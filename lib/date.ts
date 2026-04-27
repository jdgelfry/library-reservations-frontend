export function toEndOfDayIso(date: string): string {
  return new Date(`${date}T23:59:59`).toISOString();
}

export function toStartOfDayIso(date: string): string {
  return new Date(`${date}T00:00:00`).toISOString();
}

export function formatDate(value?: string | null): string {
  if (!value) return '-';
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
