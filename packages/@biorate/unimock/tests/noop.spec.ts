import { describe, it, expect } from 'vitest';
import { noop } from '../src';

describe('noop', () => {
  it('returns itself for any property access', () => {
    expect(noop.foo).toBe(noop);
    expect(noop.bar.baz).toBe(noop);
    expect(noop.deeply.nested.property).toBe(noop);
  });

  it('returns itself for method calls', () => {
    expect(noop.query()).toBe(noop);
    expect(noop.config.get('key')).toBe(noop);
    expect(noop.a().b().c()).toBe(noop);
  });

  it('reports any property as existing via in', () => {
    expect('query' in noop).toBe(true);
    expect('anything' in noop).toBe(true);
  });

  it('reports then and constructor as not existing', () => {
    expect('then' in noop).toBe(false);
    expect('constructor' in noop).toBe(false);
  });

  it('returns undefined for then and constructor access', () => {
    expect(noop.then).toBeUndefined();
    expect(noop.constructor).toBeUndefined();
  });

  it('is not thenable (does not break await)', async () => {
    const result = await noop;
    expect(result).toBe(noop);
  });

  it('supports for...of with empty iterator', () => {
    const items: unknown[] = [];
    for (const item of noop.items) {
      items.push(item);
    }
    expect(items).toEqual([]);
  });

  it('supports for await...of with empty async iterator', async () => {
    const items: unknown[] = [];
    for await (const item of noop.items) {
      items.push(item);
    }
    expect(items).toEqual([]);
  });

  it('stringifies to empty via toJSON', () => {
    expect(JSON.stringify(noop)).toBe('{}');
  });

  it('coercion to primitive returns empty string', () => {
    expect(`${noop}`).toBe('');
    expect(noop + '').toBe('');
  });

  it('delete returns true without error', () => {
    expect(delete noop.anything).toBe(true);
  });

  it('set returns true without error', () => {
    noop.anything = 'value';
    expect((noop as any).anything).toBe(noop);
  });

  it('typeof returns function (target is a function)', () => {
    expect(typeof noop).toBe('function');
    expect(typeof noop.callback).toBe('function');
  });

  it('supports new construct', () => {
    const instance = new (noop as any)();
    expect(instance).toBe(noop);
  });

  it('ownKeys returns all target keys (prototype, name, length for function)', () => {
    const keys = Object.getOwnPropertyNames(noop);
    expect(keys).toContain('prototype');
    expect(keys).toContain('name');
    expect(keys).toContain('length');
  });

  it('Object.keys returns only enumerable own keys (none for a bare function)', () => {
    expect(Object.keys(noop)).toEqual([]);
  });
});
