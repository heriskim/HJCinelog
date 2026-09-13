interface PosterSourceModalProps {
  onSelectLocal: () => void;
  onSelectApi: () => void;
  onCancel: () => void;
}

export default function PosterSourceModal({ onSelectLocal, onSelectApi, onCancel }: PosterSourceModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <p className="mb-4 text-zinc-800">이미지를 어떻게 등록할까요?</p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="rounded border border-zinc-300 px-4 py-2 hover:bg-zinc-50"
            onClick={onSelectLocal}
          >
            로컬에서 불러오기
          </button>
          <button
            type="button"
            className="rounded border border-zinc-300 px-4 py-2 hover:bg-zinc-50"
            onClick={onSelectApi}
          >
            API를 통해 불러오기 (TMDB)
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button type="button" className="rounded border border-zinc-300 px-4 py-2" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
