import { assert } from 'chai';
import { config, data } from './__mocks__';
import { Config } from '../';

describe('@biorate/config-loader', () => {
  it('get', () => assert.equal(config.get('two.one'), data.two.one));

  it('get default', () => assert.equal(config.get('inexistent-property', 'default'), 'default'));

  it('get inexistent', () => assert.throw(() => config.get('inexistent-property')));

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
});
