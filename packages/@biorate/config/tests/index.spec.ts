import { assert } from 'chai';
import { config, data } from './__mocks__';

describe('@biorate/config', () => {
  it('get', () => assert.equal(config.get('two.one'), data.two.one));

  it('get default', () =>
    assert.equal(config.get('non-existent-property', 'default'), 'default'));

  it('get non - existent', () => assert.throw(() => config.get('non-existent-property')));

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
    assert(config.get<RegExp>('reg') instanceof RegExp);
    assert(config.get<RegExp>('reg').test('test'));
  });

  it('template (Function)', () => {
    assert(config.get<(...args: number[]) => number>('fn') instanceof Function);
    assert(config.get<(...args: number[]) => number>('fn')(1, 2, 3) === 6);
  });
});
