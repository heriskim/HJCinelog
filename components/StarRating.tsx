"use client";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

const STAR_NUMBERS = [1, 2, 3, 4, 5];

export default function StarRating({ value, onChange, readOnly = false }: StarRatingProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {STAR_NUMBERS.map((starNumber) => (
          <Star
            key={starNumber}
            starNumber={starNumber}
            fillRatio={getFillRatio(value, starNumber)}
            onChange={readOnly ? undefined : onChange}
          />
        ))}
      </div>
      <span className="text-sm text-zinc-600">{value.toFixed(1)}</span>
    </div>
  );
}

interface StarProps {
  starNumber: number;
  fillRatio: number;
  onChange?: (value: number) => void;
}

function Star({ starNumber, fillRatio, onChange }: StarProps) {
  function handleHalfClick() {
    onChange?.(starNumber - 0.5);
  }

  function handleFullClick() {
    onChange?.(starNumber);
  }

  return (
    <div className="relative h-7 w-7 text-2xl leading-none select-none">
      <span className="pointer-events-none absolute inset-0 overflow-hidden text-zinc-300" aria-hidden>
        ★
      </span>
      <span
        className="pointer-events-none absolute inset-0 overflow-hidden text-amber-400"
        style={{ width: `${fillRatio * 100}%` }}
        aria-hidden
      >
        ★
      </span>
      {onChange ? (
        <>
          <button
            type="button"
            aria-label={`${starNumber - 0.5}점`}
            className="absolute inset-y-0 left-0 w-1/2"
            onClick={handleHalfClick}
          />
          <button
            type="button"
            aria-label={`${starNumber}점`}
            className="absolute inset-y-0 right-0 w-1/2"
            onClick={handleFullClick}
          />
        </>
      ) : null}
    </div>
  );
}

function getFillRatio(value: number, starNumber: number): number {
  const diff = value - (starNumber - 1);
  if (diff >= 1) {
    return 1;
  }
  if (diff <= 0) {
    return 0;
  }
  return diff;
}
