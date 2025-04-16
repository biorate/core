import { Config } from '../../src';

export const data = {
  one: 1,
  two: {
    one: 'one',
    two: 'two',
  },
  template: {
    one: '${two.one}',
    two: 'hello_${one}',
    object: '#{two}',
    reg: 'R{/http://yandex.ru/test/}',
    fn: 'F{a, b, c => let d = a + b + c; return d;}',
  },
};

export const config = new Config();
config.merge(data);
