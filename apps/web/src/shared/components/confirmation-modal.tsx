interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  confirmButtonClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText,
  confirmButtonClass = 'bg-white text-black hover:bg-neutral-200',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-neutral-900 p-4 rounded-[5px] w-full max-w-sm">
        <h2 className="text-lg text-white font-medium mb-2">{title}</h2>
        <p className="text-[12px] text-neutral-400 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-1 text-[12px] rounded-[3px] text-white bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1 text-[12px] rounded-[3px] text-black bg-white hover:bg-neutral-200 transition cursor-pointer disabled:opacity-50 ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
