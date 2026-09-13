interface ConfirmDialogProps {
  message: string;
  errorMessage?: string | null;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  message,
  errorMessage,
  isConfirming,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <p className="mb-4 whitespace-pre-wrap text-zinc-800">{message}</p>
        {errorMessage ? <p className="mb-4 text-sm text-red-600">{errorMessage}</p> : null}
        <div className="flex justify-end gap-2">
          <button type="button" className="rounded border border-zinc-300 px-4 py-2" onClick={onCancel}>
            취소
          </button>
          <button
            type="button"
            className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
