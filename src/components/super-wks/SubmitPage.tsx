'use client';

import { useState, useRef } from 'react';
import type { Role, User, UploadedFile, DeploymentUrl } from '@/lib/super-wks/types';
import { curriculum, submissions } from '@/lib/super-wks/mockData';

export function SubmitPage({ user, role: _role }: { user: User; role: Role }) {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [deployUrls, setDeployUrls] = useState<DeploymentUrl[]>([]);
  const [newUrlLabel, setNewUrlLabel] = useState('');
  const [newUrlValue, setNewUrlValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const weekCurriculum = curriculum.find(c => c.weekNumber === selectedWeek);
  const mySubmissions = submissions.filter(s => s.userId === user.userId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const newFile: UploadedFile = {
        fileId: `f-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: URL.createObjectURL(file),
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
      };
      setUploadedFiles(prev => [...prev, newFile]);
    });
    e.target.value = '';
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.fileId !== fileId));
  };

  const addDeployUrl = () => {
    if (!newUrlValue.trim()) return;
    const newDeploy: DeploymentUrl = {
      urlId: `url-${Date.now()}`,
      submissionId: '',
      userId: user.userId,
      url: newUrlValue.trim(),
      label: newUrlLabel.trim() || '배포 URL',
      addedAt: new Date().toISOString(),
    };
    setDeployUrls(prev => [...prev, newDeploy]);
    setNewUrlLabel('');
    setNewUrlValue('');
  };

  const removeDeployUrl = (urlId: string) => {
    setDeployUrls(prev => prev.filter(u => u.urlId !== urlId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const handleSubmit = () => {
    if (!selectedAssignment || !content.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setContent('');
    setUploadedFiles([]);
    setDeployUrls([]);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">과제 제출</h1>

      {/* Submit Form */}
      <div className="bg-[#111111] border border-[#262626] p-6 mb-8">
        <h2 className="text-sm font-medium text-white mb-4">새 과제 제출</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">주차 선택</label>
            <select
              value={selectedWeek}
              onChange={e => { setSelectedWeek(Number(e.target.value)); setSelectedAssignment(''); }}
              className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm"
            >
              {curriculum.map(c => (
                <option key={c.weekNumber} value={c.weekNumber}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">과제 선택</label>
            <select
              value={selectedAssignment}
              onChange={e => setSelectedAssignment(e.target.value)}
              className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm"
            >
              <option value="">과제를 선택하세요</option>
              {weekCurriculum?.assignments.map(a => (
                <option key={a.assignmentId} value={a.assignmentId}>{a.title} ({a.type})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <label className="block text-xs text-neutral-500 mb-1.5">내용</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="과제 내용을 입력하세요..."
            rows={5}
            className="w-full border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm placeholder-neutral-600 resize-none"
          />
        </div>

        {/* ─── File Upload (#4) ─── */}
        <div className="mb-4">
          <label className="block text-xs text-neutral-500 mb-1.5">📎 파일 첨부</label>
          <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-dashed border-[#404040] text-neutral-400 text-sm hover:border-emerald-500/40 hover:text-emerald-400 transition-all w-full text-center"
          >
            클릭하여 파일 선택 (여러 개 가능)
          </button>
          {uploadedFiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {uploadedFiles.map(f => (
                <div key={f.fileId} className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">📄</span>
                    <span className="text-white">{f.fileName}</span>
                    <span className="text-xs text-neutral-600">{formatFileSize(f.fileSize)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={f.fileUrl} download={f.fileName} className="text-xs text-emerald-400 hover:text-emerald-300">⬇️</a>
                    <button onClick={() => removeFile(f.fileId)} className="text-xs text-red-400 hover:text-red-300">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Deployment URL (#5) ─── */}
        <div className="mb-4">
          <label className="block text-xs text-neutral-500 mb-1.5">🔗 배포물 URL</label>
          <div className="flex gap-2">
            <input
              value={newUrlLabel}
              onChange={e => setNewUrlLabel(e.target.value)}
              placeholder="라벨 (예: 데모 사이트)"
              className="w-32 border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm placeholder-neutral-600"
            />
            <input
              value={newUrlValue}
              onChange={e => setNewUrlValue(e.target.value)}
              placeholder="https://..."
              className="flex-1 border border-[#404040] bg-[#171717] text-white px-3 py-2 text-sm placeholder-neutral-600"
              onKeyDown={e => e.key === 'Enter' && addDeployUrl()}
            />
            <button onClick={addDeployUrl} className="px-3 py-2 bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition-colors shrink-0">추가</button>
          </div>
          {deployUrls.length > 0 && (
            <div className="mt-2 space-y-1">
              {deployUrls.map(u => (
                <div key={u.urlId} className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">🔗</span>
                    <span className="text-neutral-400">{u.label}:</span>
                    <a href={u.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 truncate max-w-xs">{u.url}</a>
                  </div>
                  <button onClick={() => removeDeployUrl(u.urlId)} className="text-xs text-red-400 hover:text-red-300 shrink-0">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={!selectedAssignment || !content.trim()}
            className="px-6 py-2 bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            제출하기
          </button>
          {submitted && <span className="text-sm text-emerald-400">✅ 제출 완료!</span>}
        </div>
      </div>

      {/* My Submissions */}
      <h2 className="text-lg font-semibold text-white mb-4">제출 내역</h2>
      <div className="bg-[#111111] border border-[#262626]">
        {mySubmissions.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">아직 제출한 과제가 없습니다.</div>
        ) : (
          <div className="divide-y divide-[#1a1a1a]">
            {mySubmissions.map(s => (
              <div key={s.submissionId} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{s.weekNumber}주차 과제</span>
                  <div className="flex items-center gap-2">
                    {s.feedback ? (
                      <span className="text-[10px] px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">피드백 완료</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 border border-amber-500/20 bg-amber-500/10 text-amber-400">리뷰 대기</span>
                    )}
                    <span className="text-xs text-neutral-600">{new Date(s.submittedAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-400">{s.content}</p>
                {/* Show attached files */}
                {s.files && s.files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {s.files.map(f => (
                      <a key={f.fileId} href={f.fileUrl} download={f.fileName} className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-1 hover:bg-emerald-500/10">
                        📄 {f.fileName}
                      </a>
                    ))}
                  </div>
                )}
                {/* Show deployment URLs */}
                {s.deploymentUrls && s.deploymentUrls.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {s.deploymentUrls.map(u => (
                      <a key={u.urlId} href={u.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 bg-blue-500/5 border border-blue-500/10 px-2 py-1 hover:bg-blue-500/10">
                        🔗 {u.label}
                      </a>
                    ))}
                  </div>
                )}
                {s.feedback && (
                  <div className="mt-3 bg-emerald-500/5 border border-emerald-500/10 p-3">
                    <div className="text-xs text-neutral-500 mb-1">피드백</div>
                    <p className="text-sm text-emerald-300">{s.feedback.comment}</p>
                    {s.feedback.score && <span className="text-xs text-emerald-400 mt-1 block">점수: {s.feedback.score}점</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
