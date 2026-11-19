class Config {
  helpers = {
    fromClass: (s: string) => `class:${s}`,
  };
  hooks = {
    async beforeAll(ctx: { logger: { log: (m: string) => void } }) {
      ctx.logger.log('CLASS_HOOK_RAN');
    },
  };
  bogus = 1;
}
export default Config;
