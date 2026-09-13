interface AlertDialogProps {
  message: string;
  onClose: () => void;
}

export default function AlertDialog({ message, onClose }: AlertDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <p className="mb-4 whitespace-pre-wrap text-zinc-800">{message}</p>
        <div className="flex justify-end">
          <button type="button" className="rounded bg-zinc-900 px-4 py-2 text-white" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
