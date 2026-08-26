interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex justify-center gap-1">
      {pageNumbers.map((pageNumber) => (
        <PageButton key={pageNumber} pageNumber={pageNumber} isActive={pageNumber === page} onChange={onChange} />
      ))}
    </div>
  );
}

interface PageButtonProps {
  pageNumber: number;
  isActive: boolean;
  onChange: (page: number) => void;
}

function PageButton({ pageNumber, isActive, onChange }: PageButtonProps) {
  function handleClick() {
    onChange(pageNumber);
  }

  return (
    <button
      type="button"
      className={`h-8 w-8 rounded text-sm ${
        isActive ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"
      }`}
      onClick={handleClick}
    >
      {pageNumber}
    </button>
  );
}
