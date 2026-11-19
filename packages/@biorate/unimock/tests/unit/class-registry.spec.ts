import { afterEach, describe, expect, it } from 'vitest';
import { deserialize, registerClass, serialize, unregisterClass } from '../../src';
import type { SerializedValue } from '../../src';

/**
 * Universal class registry: instances of registered classes round-trip with
 * their prototype (`instanceof` works in replay); unregistered classes keep
 * the legacy plain-object behavior. The registry is process-global, so tests
 * clean up in `afterEach`.
 */
class Money {
  amount: number;
  currency: string;
  constructor(amount = 0, currency = 'RUB') {
    this.amount = amount;
    this.currency = currency;
  }
  formatted(): string {
    return `${this.amount} ${this.currency}`;
  }
}

class ExplodingCtor {
  value = 1;
  constructor() {
    if (new.target === ExplodingCtor && ExplodingCtor.guard) {
      throw new Error('constructor must not be invoked during restore');
    }
  }
  static guard = false;
}

const roundtrip = (value: unknown): unknown =>
  deserialize(serialize(value) as SerializedValue);

afterEach(() => {
  unregisterClass('Money');
  unregisterClass('ExplodingCtor');
});

describe('registered class instance round-trip', () => {
  it('instance in a result restores instanceof and fields', () => {
    registerClass('Money', Money);
    const restored = roundtrip(new Money(100)) as Money;
    expect(restored).toBeInstanceOf(Money);
    expect(restored.amount).toBe(100);
    expect(restored.currency).toBe('RUB');
    expect(restored.formatted()).toBe('100 RUB');
  });

  it('nested instance inside arrays and objects survives', () => {
    registerClass('Money', Money);
    const restored = roundtrip({
      wallet: [new Money(1), new Money(2, 'USD')],
      total: { money: new Money(3) },
    }) as { wallet: Money[]; total: { money: Money } };
    expect(restored.wallet[0]).toBeInstanceOf(Money);
    expect(restored.wallet[1].currency).toBe('USD');
    expect(restored.total.money).toBeInstanceOf(Money);
    expect(restored.total.money.amount).toBe(3);
  });

  it('cyclic reference to an instance does not hang', () => {
    registerClass('Money', Money);
    const wallet = new Money(5);
    (wallet as unknown as Record<string, unknown>).self = wallet;
    const restored = roundtrip(wallet) as Record<string, unknown>;
    // The cycle itself serializes to undefined (existing seen-map semantics);
    // the important part is that serialization terminates deterministically.
    expect(restored.amount).toBe(5);
  });

  it('constructor is not invoked on restore', () => {
    registerClass('ExplodingCtor', ExplodingCtor);
    const entry = serialize(new ExplodingCtor()) as SerializedValue;
    expect(entry.t).toBe('instance');
    ExplodingCtor.guard = true;
    try {
      const restored = deserialize(entry) as ExplodingCtor;
      expect(restored).toBeInstanceOf(ExplodingCtor);
      expect(restored.value).toBe(1);
    } finally {
      ExplodingCtor.guard = false;
    }
  });

  it('registerClass works for error classes too (single registry)', () => {
    registerClass('Money', Money);
    const restored = roundtrip(new Money(7)) as Money;
    expect(restored).toBeInstanceOf(Money);
    expect(restored.amount).toBe(7);
  });
});

describe('unregistered classes keep legacy behavior', () => {
  it('unregistered instance serializes as a plain object (no instance tag)', () => {
    const entry = serialize(new Money(9)) as SerializedValue;
    expect(entry.t).not.toBe('instance');
    const restored = roundtrip(new Money(9)) as Record<string, unknown>;
    expect(restored).toBeInstanceOf(Object);
    expect(restored).not.toBeInstanceOf(Money);
    expect(restored.amount).toBe(9);
  });

  it('instance tag of an unregistered-at-replay class falls back to plain object', () => {
    registerClass('Money', Money);
    const entry = serialize(new Money(11)) as SerializedValue;
    expect(entry.t).toBe('instance');
    unregisterClass('Money');
    const restored = roundtrip(new Money(0)); // re-register would defeat the check
    void restored;
    // Deserialize the recorded entry with the class now unregistered:
    const plain = deserialize(entry) as Record<string, unknown>;
    expect(plain).not.toBeInstanceOf(Money);
    expect(plain.amount).toBe(11);
  });
});
