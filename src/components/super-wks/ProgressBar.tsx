'use client';

interface ProgressBarProps {
  value: number;
  label?: string;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, label, size = 'md' }: ProgressBarProps) {
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-xs text-neutral-500 w-12 shrink-0">{label}</span>}
      <div className={`flex-1 ${height} bg-[#1a1a1a] border border-[#262626] overflow-hidden`}>
        <div
          className={`${height} transition-all duration-500 ${
            clampedValue >= 100 ? 'bg-emerald-500' : clampedValue > 0 ? 'bg-emerald-500/70' : 'bg-transparent'
          }`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      <span className="text-xs text-neutral-500 w-10 text-right shrink-0">{clampedValue}%</span>
    </div>
  );
}
