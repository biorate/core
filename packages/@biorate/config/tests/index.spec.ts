import { assert } from 'chai';
import { config, data } from './__mocks__';

describe('@biorate/config', () => {
  it('get', () => assert.equal(config.get('two.one'), data.two.one));

  it('get default', () =>
    assert.equal(config.get('non-existent-property', 'default'), 'default'));

  it('get not existing', () => assert.throw(() => config.get('not-existing-property')));

  it('has', () => assert(config.has('two.one')));

  it('has no', () => assert(!config.has('two.three')));

  it('set', () => {
    const value = 1;
    config.set('three.one', value);
    assert(config.has('three.one'));
    assert.equal(config.get('three.one'), value);
  });

  it('merge', () => {
    const value = { a: { b: { c: true } } };
    config.merge(value);
    assert(config.has('a.b.c'));
    assert.equal(config.get('a.b.c'), value.a.b.c);
  });

  it('template (string)', () => {
    assert.equal(config.get('template.one'), config.get('two.one'));
    assert.equal(config.get('template.two'), 'hello_' + config.get('one'));
  });

  it('template (link)', () => {
    assert.equal(config.get('template.object'), config.get('two'));
  });

  it('template (RegExp)', () => {
    assert(config.get<RegExp>('template.reg') instanceof RegExp);
    assert(config.get<RegExp>('template.reg').test('http://yandex.ru/test'));
    assert(
      JSON.stringify(config.get<string>('template.reg')) ===
        JSON.stringify(data.template.reg),
    );
  });

  it('template (Function)', () => {
    assert(config.get<(...args: number[]) => number>('template.fn') instanceof Function);
    assert(config.get<(...args: number[]) => number>('template.fn')(1, 2, 3) === 6);
  });

  for (const { data, template, result } of [
    { data: { a: 1, b: 2, c: 3 }, template: '!{object}', result: {} },
    { data: [1, 2, 3], template: '!{array}', result: [] },
    { data: 'test', template: '!{void}', result: void 0 },
    { data: 123, template: '!{null}', result: null },
    { data: false, template: '!{string}', result: '' },
    { data: [1, 2, 3], template: '!{ }', result: null },
  ])
    it(`template (empty) - ${template}`, () => {
      config.merge({ data });
      config.merge({ data: template });
      assert.deepEqual(config.get('data'), result);
    });

  it('templated default value', () => {
    const def = 'test';
    config.merge({ default_value: { test: '#{test}' } });
    assert.deepEqual(config.get<string>('default_value.test', def), def);
  });
});
