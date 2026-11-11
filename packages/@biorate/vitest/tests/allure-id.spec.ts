import { expect, test, vi } from 'vitest';
import { allureId } from 'allure-js-commons';
import { Vitest } from '../src';

vi.mock('allure-js-commons', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  allureId: vi.fn().mockResolvedValue(undefined),
  step: vi.fn(async (_name: string, fn: () => Promise<void> | void) => await fn()),
}));

const { suite, test: testDecorator, id } = new Vitest();

@suite('Allure @id decorator')
class AllureIdTests {
  @id('some-id')
  @testDecorator('should apply allure id metadata')
  async testWithId() {
    expect(1 + 1).toBe(2);
  }
}

test('allureId is called with the value from @id decorator', () => {
  expect(vi.mocked(allureId)).toHaveBeenCalledWith('some-id');
});
