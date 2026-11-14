/** Replaces `{key}` placeholders in a dictionary string (kept separate so islands can import it without the dictionaries). */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}
