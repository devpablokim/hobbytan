const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const openaiKey = defineSecret("OPENAI_API_KEY");
const smtpPassword = defineSecret("SMTP_PASSWORD");

async function callOpenAI(messages, opts = {}) {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${openaiKey.value()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-4o-mini", messages, temperature: opts.temp || 0.9, max_tokens: opts.maxTokens || 1000, response_format: { type: "json_object" } }),
  });
  if (!resp.ok) throw new Error(`OpenAI ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  return JSON.parse(data.choices[0].message.content);
}

exports.brcombat = onRequest({ region: "asia-northeast3", cors: true, secrets: [openaiKey] }, async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const { playerA, playerB } = req.body;
    const prompt = `당신은 배틀로얄 게임의 전투 해설가입니다. 유머러스하고 드라마틱하게 전투를 묘사하세요.

[플레이어A: ${playerA.name}]
- 무기: ${playerA.weapon.emoji} ${playerA.weapon.name} (타입: ${playerA.weapon.type}, ATK:${playerA.weapon.atk}, DEF:${playerA.weapon.def}, SPD:${playerA.weapon.spd})
- 특수능력: ${playerA.weapon.specName} — ${playerA.weapon.specDesc}
- HP: ${playerA.hp}
- 전략: "${playerA.strategy || '(전략 없음 — 본능에 따라 싸운다)'}"

[플레이어B: ${playerB.name}]
- 무기: ${playerB.weapon.emoji} ${playerB.weapon.name} (타입: ${playerB.weapon.type}, ATK:${playerB.weapon.atk}, DEF:${playerB.weapon.def}, SPD:${playerB.weapon.spd})
- 특수능력: ${playerB.weapon.specName} — ${playerB.weapon.specDesc}
- HP: ${playerB.hp}
- 전략: "${playerB.strategy || '(전략 없음 — 본능에 따라 싸운다)'}"

## 전투 규칙
1. **HP가 0이 될 때까지 라운드를 계속** 진행하세요. 3라운드에서 끝나지 않으면 4, 5라운드도 가능합니다. 반드시 한 명의 HP가 0 이하가 되어야 전투가 끝납니다.
2. **전략 텍스트를 적극적으로 반영**하세요. 플레이어가 구체적인 전략을 썼다면 전투 묘사에 반영하세요.
3. **어이없거나 뜬금없는 전략은 무시**하세요 (예: "상대방 컴퓨터를 해킹한다", "핵폭탄을 100개 소환" 등). 이 경우 시스템 기본 전투로 처리하세요.
4. **역전 이벤트를 추가**하세요! 약한 무기를 든 플레이어도 20~30% 확률로 기적적인 역전이 가능합니다:
   - 신이 도와준다 (갑자기 빛이 내리쬐며 힘이 솟구친다)
   - 상대가 미끄러진다 / 발을 헛딛는다
   - 상대가 순간 기절한다
   - 무기가 갑자기 각성한다
   - 바람이 도와준다 등

각 라운드는 2~3문장으로 짧고 임팩트있게. 한국어로 재미있게!

반드시 아래 JSON 형식으로만 응답하세요:
{"rounds":[{"round":1,"text":"..."},{"round":2,"text":"..."},...],"winner":"A" 또는 "B","damageToA":숫자(A의 총 받은 데미지),"damageToB":숫자(B의 총 받은 데미지),"summary":"결과 한줄 요약"}`;

    const result = await callOpenAI([{ role: "user", content: prompt }], { temp: 0.9, maxTokens: 1000 });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

exports.brbotaction = onRequest({ region: "asia-northeast3", cors: true, secrets: [openaiKey] }, async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const { actionType, botName, botWeapon, botHp, mapSize, botX, botY, nearbyPlayers, opponentWeapon, opponentHp, personality, turn, aliveCount, nearbyItems, stormBorder } = req.body;
    const personalityDesc = {
      aggressive: '호전적이고 전투를 즐기는 성격. 적을 보면 무조건 돌진한다. 도망은 치지 않는다.',
      cautious: '신중하고 조심스러운 성격. HP가 낮으면 도망가고, 유리할 때만 싸운다. 불필요한 전투는 피한다.',
      explorer: '탐험가 성격. 아이템을 찾아 돌아다니고 맵을 넓게 이동한다. 전투보다 장비 강화를 선호.',
      camper: '한 곳에 머물며 기다리는 성격. 적이 가까이 오면 공격하지만, 굳이 찾아다니지 않는다.',
      hunter: '사냥꾼 성격. 중앙으로 이동해 적을 추적한다. 계획적이고 효율적으로 킬을 노린다.'
    };
    const pDesc = personalityDesc[personality] || personalityDesc.aggressive;
    let prompt = "";
    if (actionType === "move") {
      prompt = `당신은 배틀로얄 게임의 플레이어 "${botName}"입니다. 사람처럼 생각하고 행동하세요.

[내 성격] ${pDesc}
[무기] ${botWeapon.emoji} ${botWeapon.name} (ATK:${botWeapon.atk}, DEF:${botWeapon.def}, SPD:${botWeapon.spd}, 특수:${botWeapon.specName})
[HP] ${botHp}/100
[위치] (${botX}, ${botY}), 맵 ${mapSize}x${mapSize}
[턴] ${turn || '?'}, 생존자 ${aliveCount || '?'}명
[자기장] 외곽 ${stormBorder || 0}칸 위험
[주변 적] ${nearbyPlayers || "없음"}
[주변 아이템] ${nearbyItems || "없음"}

내 성격에 맞게 8방향 이동 또는 대기를 선택하세요. 이유도 짧게.
JSON: {"dx":-1~1,"dy":-1~1,"reason":"한국어 이유 1문장"}`;
    } else {
      prompt = `당신은 배틀로얄 플레이어 "${botName}". 성격: ${pDesc}
무기: ${botWeapon.emoji} ${botWeapon.name} (ATK:${botWeapon.atk}, 특수:${botWeapon.specName}—${botWeapon.specDesc}). HP:${botHp}.
상대: ${opponentWeapon?.emoji} ${opponentWeapon?.name} (ATK:${opponentWeapon?.atk}), HP:${opponentHp}.
내 성격에 맞는 전투 전략 1~2문장 한국어. JSON: {"strategy":"전략"}`;
    }
    const result = await callOpenAI([{ role: "user", content: prompt }], { temp: 0.8, maxTokens: 200 });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ═══════ Contact Email Cloud Function ═══════
exports.contactEmail = onRequest({ region: "asia-northeast3", cors: true, secrets: [smtpPassword] }, async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
  try {
    const { name, email, phone, company, message } = req.body;
    if (!name || !email || !phone || !message) { res.status(400).json({ error: "필수 항목을 모두 입력해 주세요." }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { res.status(400).json({ error: "올바른 이메일을 입력해 주세요." }); return; }

    const nodemailer = require("nodemailer");
    const admin = require("firebase-admin");
    if (!admin.apps.length) admin.initializeApp();
    const db = admin.firestore();

    const docRef = await db.collection("contacts").add({
      name, email, phone, company: company || "", message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "new"
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", port: 587, secure: false,
      auth: { user: "tanhyu.kim@gmail.com", pass: smtpPassword.value() }
    });
    const fromAddr = '"하비탄 AI" <pablo@hobbytan.com>';
    const adminTo = "pablo@hobbytan.com,tanhyu.kim@gmail.com";
    const logo = "https://hobbytan.com/logo-white.svg";
    const ts = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

    const adminHTML = `<!DOCTYPE html><html><body style="margin:0;padding:0;font-family:system-ui,sans-serif;background:#f5f5f5"><table style="width:100%;border-collapse:collapse"><tr><td align="center" style="padding:40px 20px"><table style="width:100%;max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,.1)"><tr><td style="background:linear-gradient(135deg,#059669,#10b981);padding:32px 40px;text-align:center"><img src="${logo}" alt="HOBBYTAN AI" style="height:32px;margin-bottom:12px"><br><span style="color:#fff;font-size:24px;font-weight:600">새로운 문의가 도착했습니다</span><p style="margin:8px 0 0;color:rgba(255,255,255,.9);font-size:14px">하비탄 AI 웹사이트</p></td></tr><tr><td style="padding:40px"><table style="width:100%;border-collapse:collapse"><tr><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><span style="color:#6b7280;font-size:12px;text-transform:uppercase">이름</span><br><strong style="color:#111;font-size:16px">${name}</strong></td></tr><tr><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><span style="color:#6b7280;font-size:12px;text-transform:uppercase">이메일</span><br><a href="mailto:${email}" style="color:#059669;font-size:16px">${email}</a></td></tr><tr><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><span style="color:#6b7280;font-size:12px;text-transform:uppercase">연락처</span><br><a href="tel:${phone}" style="color:#059669;font-size:16px">${phone}</a></td></tr><tr><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><span style="color:#6b7280;font-size:12px;text-transform:uppercase">회사/기관명</span><br><strong style="color:#111;font-size:16px">${company||"-"}</strong></td></tr><tr><td style="padding:12px 0"><span style="color:#6b7280;font-size:12px;text-transform:uppercase">문의 내용</span><div style="margin-top:8px;padding:16px;background:#f9fafb;border-radius:8px;border-left:4px solid #059669"><p style="margin:0;color:#374151;font-size:15px;line-height:1.6;white-space:pre-wrap">${message}</p></div></td></tr></table><table style="width:100%;margin-top:24px"><tr><td align="center"><a href="mailto:${email}" style="display:inline-block;padding:14px 32px;background:#059669;color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px">답장하기</a></td></tr></table></td></tr><tr><td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb"><p style="margin:0;color:#9ca3af;font-size:12px">${ts}</p><p style="margin:8px 0 0;color:#9ca3af;font-size:12px">하비탄 AI | pablo@hobbytan.com</p></td></tr></table></td></tr></table></body></html>`;

    const userHTML = `<!DOCTYPE html><html><body style="margin:0;padding:0;font-family:system-ui,sans-serif;background:#f5f5f5"><table style="width:100%;border-collapse:collapse"><tr><td align="center" style="padding:40px 20px"><table style="width:100%;max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,.1)"><tr><td style="background:linear-gradient(135deg,#059669,#10b981);padding:40px;text-align:center"><img src="${logo}" alt="HOBBYTAN AI" style="height:32px;margin-bottom:12px"><br><span style="color:#fff;font-size:28px;font-weight:600">문의해 주셔서 감사합니다</span></td></tr><tr><td style="padding:40px"><p style="color:#374151;font-size:16px;line-height:1.7">안녕하세요, <strong>${name}</strong>님!</p><p style="color:#374151;font-size:16px;line-height:1.7">하비탄 AI에 문의해 주셔서 진심으로 감사드립니다.<br>귀하의 문의가 정상적으로 접수되었습니다.</p><div style="padding:24px;background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border-radius:12px;margin:24px 0;text-align:center"><p style="margin:0;color:#059669;font-size:16px;font-weight:600">담당자가 빠르게 확인 후 연락 드리겠습니다.</p><p style="margin:8px 0 0;color:#6b7280;font-size:14px">영업일 기준 48시간 이내 회신 드립니다.</p></div><div style="margin-top:32px;padding:24px;background:#f9fafb;border-radius:8px"><h3 style="margin:0 0 16px;color:#111;font-size:14px;text-transform:uppercase;letter-spacing:.05em">접수된 문의 내용</h3><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:80px">이름</td><td style="padding:8px 0;color:#111;font-size:14px">${name}</td></tr><tr><td style="padding:8px 0;color:#6b7280;font-size:14px">이메일</td><td style="padding:8px 0;color:#111;font-size:14px">${email}</td></tr><tr><td style="padding:8px 0;color:#6b7280;font-size:14px">연락처</td><td style="padding:8px 0;color:#111;font-size:14px">${phone}</td></tr>${company?`<tr><td style="padding:8px 0;color:#6b7280;font-size:14px">회사</td><td style="padding:8px 0;color:#111;font-size:14px">${company}</td></tr>`:""}</table></div><p style="margin:32px 0 0;color:#6b7280;font-size:14px;line-height:1.6">추가 문의사항이 있으시면 <a href="mailto:pablo@hobbytan.com" style="color:#059669;text-decoration:none">pablo@hobbytan.com</a>으로 연락해 주세요.</p></td></tr><tr><td style="background:#0a0a0a;padding:32px 40px;text-align:center"><p style="margin:0;color:#fff;font-size:16px;font-weight:600">하비탄 AI</p><p style="margin:8px 0 0;color:#9ca3af;font-size:13px">당신과 AI 기술 사이, 하비탄 AI</p><p style="margin:16px 0 0;color:#6b7280;font-size:12px">pablo@hobbytan.com</p></td></tr></table><p style="margin:24px 0 0;color:#9ca3af;font-size:11px;text-align:center">본 메일은 하비탄 AI 웹사이트 문의에 대한 자동 발송 메일입니다.</p></td></tr></table></body></html>`;

    await Promise.allSettled([
      transporter.sendMail({ from: fromAddr, to: adminTo, subject: `[문의] ${name}님이 문의를 남기셨습니다`, html: adminHTML }),
      transporter.sendMail({ from: fromAddr, to: email, subject: "[하비탄 AI] 문의해 주셔서 감사합니다", html: userHTML })
    ]);

    res.json({ success: true, message: "문의가 성공적으로 접수되었습니다.", id: docRef.id });
  } catch (e) {
    console.error("contactEmail error:", e);
    res.status(500).json({ error: "문의 접수 중 오류가 발생했습니다." });
  }
});
