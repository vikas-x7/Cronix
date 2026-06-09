import { useState } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  confirmButtonClass?: string;
  confirmInput?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText,
  confirmButtonClass = 'bg-white text-black hover:bg-neutral-200',
  confirmInput,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const isInputValid = !confirmInput || inputValue === confirmInput;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-neutral-900 p-4 rounded-[5px] w-full max-w-sm">
        <h2 className="text-lg text-white font-medium mb-2">{title}</h2>
        <p className="text-[12px] text-neutral-400 mb-4">{message}</p>
        {confirmInput && (
          <div className="mb-4">
            <p className="text-[12px] text-neutral-400 mb-1.5">
              Type{' '}
              <span className="text-white font-medium">"{confirmInput}"</span>{' '}
              to confirm
            </p>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmInput}
              className="w-full bg-neutral-800 border border-[#393939] rounded-[3px] px-3 py-2 text-[13px] text-white outline-none focus:border-neutral-500 transition placeholder:text-neutral-600"
              autoFocus
            />
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setInputValue('');
              onCancel();
            }}
            className="px-4 py-2 text-[12px] rounded-[3px] text-white bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setInputValue('');
              onConfirm();
            }}
            disabled={!isInputValid}
            className={`px-4 py-2 text-[12px] rounded-[3px] text-black bg-white hover:bg-neutral-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
