import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonClass?: string;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmButtonClass = 'bg-black hover:bg-[#222222]',
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-[3px] shadow-xl w-full max-w-sm border border-[#DDDDDD] animate-in zoom-in-95 duration-200">
        <h2 className="text-lg text-[#171717] font-medium mb-2">{title}</h2>
        <p className="text-[12px] text-[#444444] mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-[12px] text-[#171717] bg-[#F5F5F5] hover:bg-[#E5E5E5] rounded-[3px] transition cursor-pointer">
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-4 py-2 text-[12px] text-white rounded-[3px] transition cursor-pointer ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
