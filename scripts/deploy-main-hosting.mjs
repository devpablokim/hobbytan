// Publish the reviewed static homepage while preserving the live SSR backend,
// every existing route, and the assets used by that backend's pinned revision.
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { GoogleAuth } from 'google-auth-library';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = 'sites/hobbytan-ai';
const api = 'https://firebasehosting.googleapis.com/v1beta1';
const recordDir = path.join(root, '.production-deploy');
const deploy = process.argv.includes('--deploy');
const companyProfileOnly = process.argv.includes('--company-profile-only');
const updateCompanyProfile = companyProfileOnly || process.argv.includes('--update-company-profile');
const companyProfilePath = '/downloads/HOBBYTAN_AI_Company_Profile_2026.pdf';
// --contact: also publish the light-design /contact page (prerendered .next/server/app/contact.html)
// and allow replacing exactly that one existing path. Without the flag nothing below changes.
const includeContact = process.argv.includes('--contact');
const replaceablePaths = ['/index.html', '/index.txt', ...(includeContact ? ['/contact.html'] : [])];

async function main() {
  if (includeContact && companyProfileOnly) throw new Error('--contact cannot be combined with --company-profile-only.');
  if (includeContact) {
    // The contact page posts to the pinned SSR backend, so it must be the reviewed light page.
    const contactHtml = await readFile(path.join(root, '.next/server/app/contact.html'), 'utf8');
    const contactChecks = {
      lightTheme: contactHtml.includes('data-theme="light"') && contactHtml.includes('data-page="contact"'),
      heading: contactHtml.includes('지금 바꾸고 싶은') && contactHtml.includes('업무를 들려주세요.'),
      consent: contactHtml.includes('개인정보 수집·이용에 동의합니다 (필수)'),
      programLink: contactHtml.includes('href="/shop"'),
      canonical: contactHtml.includes('<link rel="canonical" href="https://hobbytan.com/contact"/>'),
      noOldWording: !contactHtml.includes('파워워크샵') && !contactHtml.includes('logo-white.svg'),
      indexable: !contactHtml.includes('content="noindex') && !contactHtml.includes('content="nofollow'),
    };
    const failed = Object.entries(contactChecks).filter(([, ok]) => !ok).map(([name]) => name);
    if (failed.length) throw new Error(`Build the reviewed, indexable light /contact page first (failed: ${failed.join(', ')}).`);
  }
  const candidates = [];
  for (const name of await readdir(path.resolve(root, '../firebase'))) {
    if (!name.endsWith('.json')) continue;
    const credential = JSON.parse(await readFile(path.resolve(root, '../firebase', name), 'utf8'));
    if (credential.type === 'service_account' && credential.project_id === 'hobbytan-ai') candidates.push(credential);
  }
  if (candidates.length !== 1) throw new Error('Expected one hobbytan-ai service account.');
  const client = await new GoogleAuth({ credentials: candidates[0], scopes: ['https://www.googleapis.com/auth/firebase.hosting'] }).getClient();
  const request = async (endpoint, options = {}) => (await client.request({ url: `${api}/${endpoint}`, ...options })).data;
  const listFiles = async version => {
    const files = []; let pageToken;
    do {
      const result = await request(`${version}/files`, { params: { pageSize: 1000, status: 'ACTIVE', ...(pageToken ? { pageToken } : {}) } });
      files.push(...(result.files ?? [])); pageToken = result.nextPageToken;
    } while (pageToken);
    return files;
  };
  const previous = (await request(`${site}/releases`, { params: { pageSize: 1 } })).releases[0];
  const previousFiles = await listFiles(previous.version.name);
  if (!previousFiles.length || !previous.version.config?.rewrites?.some(rule => rule.run?.serviceId === 'ssrhobbytanai')) {
    throw new Error('Expected the existing live files and SSR rewrite.');
  }
  if (!companyProfileOnly) {
    const html = await readFile(path.join(root, '.next/server/app/index.html'), 'utf8');
    if (!html.includes('data-theme="light"') || !html.includes('dashboards-v2/logistics-desktop.jpg') || html.includes('content="noindex')) {
      throw new Error('Build the reviewed, indexable main homepage first.');
    }
  }
  const files = Object.fromEntries(previousFiles.map(file => [file.path, file.hash]));
  const blobs = new Map(); const changed = [];
  const add = async (filename, publicPath) => {
    const bytes = await readFile(filename);
    const isCompanyProfile = publicPath === companyProfilePath;
    if (isCompanyProfile && !bytes.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
      throw new Error(`Expected a PDF signature for the company profile: ${publicPath}`);
    }
    if (/\.(?:html|txt|js|css|json|rsc|svg)$/.test(filename) && /-----BEGIN (?:RSA )?PRIVATE KEY-----/.test(bytes.toString())) {
      throw new Error('Private key marker in public output.');
    }
    const compressed = gzipSync(bytes, { level: 9 });
    const hash = createHash('sha256').update(compressed).digest('hex');
    if (files[publicPath] && files[publicPath] !== hash && !replaceablePaths.includes(publicPath) && !(updateCompanyProfile && isCompanyProfile)) {
      // Existing shared assets must stay available to the pinned server revision.
      // Only the exact company-profile PDF may be replaced with its explicit flag.
      const response = await fetch(`https://hobbytan.com${publicPath}`);
      if (!response.ok || !Buffer.from(await response.arrayBuffer()).equals(bytes)) {
        throw new Error(`Refusing to replace an existing shared asset: ${publicPath}`);
      }
      return;
    }
    if (files[publicPath] !== hash) changed.push(publicPath);
    files[publicPath] = hash; blobs.set(hash, compressed);
  };
  const addTree = async (directory, prefix) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const filename = path.join(directory, entry.name);
      const destination = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) await addTree(filename, destination);
      else if (entry.isFile()) await add(filename, destination);
    }
  };
  if (companyProfileOnly) {
    await add(path.join(root, 'public', companyProfilePath), companyProfilePath);
  } else {
    await add(path.join(root, '.next/server/app/index.html'), '/index.html');
    await add(path.join(root, '.next/server/app/index.rsc'), '/index.txt');
    if (includeContact) await add(path.join(root, '.next/server/app/contact.html'), '/contact.html');
    await addTree(path.join(root, '.next/static'), '/_next/static');
    await addTree(path.join(root, 'public/light-assets'), '/light-assets');
    await addTree(path.join(root, 'public/downloads'), '/downloads');
    await add(path.join(root, 'public/logo-black.svg'), '/logo-black.svg');
  }
  const config = structuredClone(previous.version.config);
  const localHosting = JSON.parse(await readFile(path.join(root, 'firebase.json'), 'utf8')).hosting;
  for (const rule of localHosting.headers ?? []) {
    if (!rule.source.startsWith('/downloads/')) continue;
    config.headers = (config.headers ?? []).filter(existing => existing.glob !== rule.source);
    config.headers.push({ glob: rule.source, headers: Object.fromEntries(rule.headers.map(({ key, value }) => [key.toLowerCase(), value])) });
  }
  if (JSON.stringify(config).includes('noindex') || config.redirects?.some(rule => rule.glob === '/' || rule.glob === '/contact')) {
    throw new Error('Unexpected live noindex or main/contact redirect; inspect before deploying.');
  }
  await mkdir(recordDir, { recursive: true });
  const plan = { previousVersion: previous.version.name, previousRelease: previous.name, previousFileCount: previousFiles.length, fileCount: Object.keys(files).length, changed, updateCompanyProfile, companyProfileOnly, ...(includeContact ? { includeContact } : {}), config };
  await writeFile(path.join(recordDir, 'main-plan.json'), JSON.stringify(plan, null, 2));
  console.log(JSON.stringify({ previousVersion: plan.previousVersion, existingFilesPreserved: previousFiles.filter(file => !changed.includes(file.path)).length, changedFiles: changed.length, totalFiles: plan.fileCount, backend: config.rewrites, deploy, ...(includeContact ? { includeContact, changed } : {}) }, null, 2));
  if (!deploy) return;

  const version = await request(`${site}/versions`, { method: 'POST', data: { config } });
  await writeFile(path.join(recordDir, 'pending-version.json'), JSON.stringify({ previousVersion: previous.version.name, version: version.name }, null, 2));
  const entries = Object.entries(files);
  let uploadCount = 0;
  for (let offset = 0; offset < entries.length; offset += 1000) {
    const population = await request(`${version.name}:populateFiles`, { method: 'POST', data: { files: Object.fromEntries(entries.slice(offset, offset + 1000)) } });
    if (new URL(population.uploadUrl).hostname !== 'upload-firebasehosting.googleapis.com') throw new Error('Unexpected upload host.');
    const hashes = population.uploadRequiredHashes ?? [];
    for (let start = 0; start < hashes.length; start += 8) {
      await Promise.all(hashes.slice(start, start + 8).map(async hash => {
        if (!blobs.has(hash)) throw new Error('An existing live asset unexpectedly requires an upload.');
        await client.request({ url: `${population.uploadUrl}/${hash}`, method: 'POST', data: blobs.get(hash), headers: { 'Content-Type': 'application/octet-stream' } });
        uploadCount++;
      }));
    }
  }
  const active = await listFiles(version.name);
  if (active.length !== entries.length || active.some(file => files[file.path] !== file.hash)) throw new Error('Uploaded file manifest does not match the plan.');
  await request(version.name, { method: 'PATCH', params: { updateMask: 'status' }, data: { status: 'FINALIZED' } });
  const latest = (await request(`${site}/releases`, { params: { pageSize: 1 } })).releases[0];
  if (latest.name !== previous.name) throw new Error('Live release changed during preparation; review before publishing.');
  const release = await request(`${site}/releases`, { method: 'POST', params: { versionName: version.name }, data: { message: companyProfileOnly ? 'Update company profile PDF; preserve existing homepage, backend and routes.' : includeContact ? 'Update consulting homepage and light /contact page; preserve existing backend and routes.' : 'Update consulting homepage and public downloads; preserve existing backend and routes.' } });
  await writeFile(path.join(recordDir, 'main-release.json'), JSON.stringify({ previousVersion: previous.version.name, release: release.name, version: version.name, releaseTime: release.releaseTime, uploadCount, totalFiles: entries.length }, null, 2));
  console.log(JSON.stringify({ release: release.name, version: version.name, uploadCount, url: 'https://hobbytan.com' }, null, 2));
}

main().catch(error => {
  // Avoid dumping request objects containing OAuth headers or credential data.
  console.error(error.response ? `Hosting request failed: HTTP ${error.response.status}` : error.message);
  process.exitCode = 1;
});
