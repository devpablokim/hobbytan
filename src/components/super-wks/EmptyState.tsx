'use client';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export function EmptyState({ icon = '📭', title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-neutral-400 font-medium">{title}</p>
      {description && <p className="text-neutral-600 text-sm mt-1">{description}</p>}
    </div>
  );
}
