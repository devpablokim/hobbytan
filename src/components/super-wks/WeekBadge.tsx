'use client';

import type { WeekStatus } from '@/lib/super-wks/types';

const statusConfig: Record<WeekStatus, { label: string; className: string }> = {
  'completed': { label: '완료', className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  'in-progress': { label: '진행중', className: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  'not-started': { label: '대기', className: 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20' },
};

export function WeekBadge({ status }: { status: WeekStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-block text-[10px] px-2 py-0.5 border font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
