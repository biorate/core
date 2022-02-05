import { check } from './__mocks__';

describe('@biorate/amf', function () {
  describe('decode / encode', function () {
    it('string', () => check('string'));
    it('number', () => check(1));
    it('boolean', () => (check(true), check(false)));
    it('date', () => check(new Date()));
    it('null', () => check(null));
    it('undefined', () => check(undefined));
    it('NaN', () => check(NaN));
    it('object', () =>
      check({
        sub: {
          string: 'string',
          number: 1,
          boolean: { true: true, false: false },
          date: new Date(),
          null: null,
          undefined: undefined,
          NaN: NaN,
          array: [1, { a: 2 }, [1, 'string', false]],
        },
      }));
    it('array', () =>
      check([
        'string',
        1,
        true,
        false,
        new Date(),
        null,
        undefined,
        NaN,
        {
          sub: {
            string: 'string',
            number: 1,
            boolean: { true: true, false: false },
            null: null,
            undefined: undefined,
            NaN: NaN,
            array: [1, { a: 2 }, [1, 'string', false]],
          },
        },
        [1, 2, 3],
      ]));
  });
});
