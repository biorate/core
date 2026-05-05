import { expect } from 'vitest';
import { suite, test } from '../src';
import 'reflect-metadata';

@suite('Simple Test')
class SimpleTest {
  @test('should work')
  async shouldWork() {
    console.log('Test method called!');
    expect(1 + 1).toBe(2);
  }
}
