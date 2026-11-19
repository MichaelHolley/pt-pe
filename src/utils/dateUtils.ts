export function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function isOutOfRange(date: string, start: string, end: string): boolean {
  return date < start || date > end;
}
