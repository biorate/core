import Logger from '../src/logger';

describe('logger', () => {
  it('colorful prints the message as-is (no [object Function] prefix)', () => {
    const sink: string[] = [];
    const logger = new Logger((msg) => sink.push(msg));
    logger.colorful('help:\nИспользование: npx hygen create <actions>');
    expect(sink).toEqual(['help:\nИспользование: npx hygen create <actions>']);
  });

  it('colorful does not choke on literal braces in template messages', () => {
    const sink: string[] = [];
    const logger = new Logger((msg) => sink.push(msg));
    expect(() => logger.colorful('json {"x": 1}')).not.toThrow();
    expect(sink[0]).toBe('json {"x": 1}');
  });

  it('colorfulHeader prints the header line and the plain body', () => {
    const sink: string[] = [];
    const logger = new Logger((msg) => sink.push(msg));
    logger.colorfulHeader('help', 'line1\nline2');
    // chalk disables styling on a non-TTY, so only the shape is asserted
    expect(sink[0].split('\n')[0]).toBe('help:');
    expect(sink[0]).toContain('line1\nline2');
  });
});
