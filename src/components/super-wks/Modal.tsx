'use client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#111111] border border-[#262626] w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-5 border-b border-[#262626]">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">✕</button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
