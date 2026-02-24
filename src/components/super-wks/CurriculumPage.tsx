'use client';

import { useState } from 'react';
import type { Role, User, AssignmentType } from '@/lib/super-wks/types';
import { curriculum } from '@/lib/super-wks/mockData';
import { WeekBadge } from './WeekBadge';
import { Modal } from './Modal';

export function CurriculumPage({ user, role }: { user: User; role: Role }) {
  const [activeWeek, setActiveWeek] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addAssignmentOpen, setAddAssignmentOpen] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editObjectives, setEditObjectives] = useState('');

  // Add assignment form state
  const [newAssTitle, setNewAssTitle] = useState('');
  const [newAssDesc, setNewAssDesc] = useState('');
  const [newAssType, setNewAssType] = useState<AssignmentType>('text');
  const [newAssDue, setNewAssDue] = useState(5);
  const [newAssRequired, setNewAssRequired] = useState(true);

  const cur = curriculum.find(c => c.weekNumber === activeWeek);
  const weekKey = `week${activeWeek}` as keyof typeof user.progress;
  const myStatus = user.progress[weekKey];

  const openEditModal = () => {
    if (cur) {
      setEditTitle(cur.title);
      setEditDesc(cur.description);
      setEditObjectives(cur.objectives.join('\n'));
      setEditModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    // In real implementation, calls dataService.updateCurriculum()
    if (cur) {
      cur.title = editTitle;
      cur.description = editDesc;
      cur.objectives = editObjectives.split('\n').filter(Boolean);
    }
    setEditModalOpen(false);
  };

  const handleAddAssignment = () => {
    if (cur) {
      cur.assignments.push({
        assignmentId: `a${Date.now()}`,
        title: newAssTitle,
        description: newAssDesc,
        type: newAssType,
        dueOffsetDays: newAssDue,
        required: newAssRequired,
      });
    }
    setNewAssTitle('');
    setNewAssDesc('');
    setNewAssType('text');
    setNewAssDue(5);
    setNewAssRequired(true);
    setAddAssignmentOpen(false);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    if (cur && confirm('이 과제를 삭제하시겠습니까?')) {
      cur.assignments = cur.assignments.filter(a => a.assignmentId !== assignmentId);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">커리큘럼</h1>

      {/* Week Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[0,1,2,3,4,5].map(w => {
          const wk = `week${w}` as keyof typeof user.progress;
          const s = user.progress[wk].status;
          return (
            <button
              key={w}
              onClick={() => setActiveWeek(w)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeWeek === w
                  ? 'bg-indigo-600 text-white'
                  : s === 'completed' ? 'bg-emerald-100 text-emerald-700'
                  : s === 'in-progress' ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {w}주차 {s === 'completed' && '✅'}
            </button>
          );
        })}
      </div>

      {cur && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{cur.title}</h2>
            <div className="flex items-center gap-2">
              <WeekBadge status={myStatus.status} />
              {role === 'admin' && (
                <button onClick={openEditModal} className="text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-lg px-3 py-1">✏️ 수정</button>
              )}
            </div>
          </div>
          <p className="text-gray-600 mb-6">{cur.description}</p>

          {/* Objectives */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2">🎯 학습 목표</h3>
            <ul className="space-y-1">
              {cur.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-indigo-500 mt-0.5">-</span>{obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          {cur.materials.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-2">📖 학습 자료</h3>
              <div className="space-y-2">
                {cur.materials.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-3">
                    <span>{m.type === 'video' ? '🎥' : m.type === 'doc' ? '📄' : '🔗'}</span>
                    <span className="text-gray-700">{m.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">📝 과제</h3>
              {role === 'admin' && (
                <button onClick={() => setAddAssignmentOpen(true)} className="text-sm bg-indigo-600 text-white rounded-lg px-3 py-1 hover:bg-indigo-700">+ 과제 추가</button>
              )}
            </div>
            {cur.assignments.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-3xl mb-2">📋</div>
                <p className="text-sm">등록된 과제가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cur.assignments.map(a => (
                  <div key={a.assignmentId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">{a.title}</div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${a.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                          {a.required ? '필수' : '선택'}
                        </span>
                        {role === 'admin' && (
                          <button onClick={() => handleDeleteAssignment(a.assignmentId)} className="text-xs text-red-400 hover:text-red-600">🗑️</button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{a.description}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-400">
                      <span>📎 {a.type === 'file' ? '파일 업로드' : a.type === 'text' ? '텍스트 작성' : '링크 제출'}</span>
                      <span>⏰ D+{a.dueOffsetDays}일</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Curriculum Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="커리큘럼 수정">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">학습 목표 (줄바꿈으로 구분)</label>
            <textarea value={editObjectives} onChange={e => setEditObjectives(e.target.value)} rows={4} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">취소</button>
            <button onClick={handleSaveEdit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">저장</button>
          </div>
        </div>
      </Modal>

      {/* Add Assignment Modal */}
      <Modal isOpen={addAssignmentOpen} onClose={() => setAddAssignmentOpen(false)} title="과제 추가">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">과제명</label>
            <input value={newAssTitle} onChange={e => setNewAssTitle(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="과제 제목" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea value={newAssDesc} onChange={e => setNewAssDesc(e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="과제 설명" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제출 유형</label>
            <select value={newAssType} onChange={e => setNewAssType(e.target.value as AssignmentType)} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="text">✏️ 텍스트</option>
              <option value="file">📎 파일</option>
              <option value="link">🔗 링크</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">마감 (D+일)</label>
              <input type="number" value={newAssDue} onChange={e => setNewAssDue(Number(e.target.value))} min={1} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={newAssRequired} onChange={e => setNewAssRequired(e.target.checked)} className="rounded" />
                필수 과제
              </label>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setAddAssignmentOpen(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">취소</button>
            <button onClick={handleAddAssignment} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">추가</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
