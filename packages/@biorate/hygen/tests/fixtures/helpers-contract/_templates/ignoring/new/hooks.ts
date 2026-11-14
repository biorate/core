const log = (entry: string): void => {
  const g = globalThis as { __helperLog?: string[] };
  if (g.__helperLog) g.__helperLog.push(entry);
};

export default class {
  async prompt(): Promise<Record<string, unknown>> {
    log('ignoring.prompt');
    return { note: 'unused' };
  }
}
