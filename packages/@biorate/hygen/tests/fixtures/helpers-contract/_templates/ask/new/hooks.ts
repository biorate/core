const log = (entry: string): void => {
  const g = globalThis as { __helperLog?: string[] };
  if (g.__helperLog) g.__helperLog.push(entry);
};

export default class {
  async prompt({ h }: { h: Record<string, unknown> }): Promise<Record<string, unknown>> {
    log(`ask.prompt:${String(h.tag)}`);
    return { note: String(h.tag) };
  }
}
