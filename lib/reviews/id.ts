const SEQUENCE_LENGTH = 5;

export function buildDatePrefix(date: Date): string {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

export function generateReviewId(existingIds: string[], now: Date): string {
  const prefix = buildDatePrefix(now);
  const sequenceNumbers = existingIds
    .filter((id) => id.startsWith(prefix))
    .map((id) => Number(id.slice(prefix.length)));
  const nextSequence = sequenceNumbers.length > 0 ? Math.max(...sequenceNumbers) + 1 : 1;
  return `${prefix}${String(nextSequence).padStart(SEQUENCE_LENGTH, "0")}`;
}
