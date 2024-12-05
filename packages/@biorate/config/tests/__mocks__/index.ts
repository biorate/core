import { Config } from '../../src';

export const data = {
  reg: 'R{/^test$/igm}',
  fn: 'F{a, b, c => let d = a + b + c; return d;}',
  one: 1,
  two: {
    one: 'one',
    two: 'two',
  },
  template: {
    one: '${two.one}',
    two: 'hello_${one}',
    object: '#{two}',
  },
};

export const config = new Config();
config.merge(data);
