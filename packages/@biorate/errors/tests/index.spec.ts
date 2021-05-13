import { assert } from 'chai';
import { TestError, msg, message, meta } from './__mocks__';

describe('Errors', () => {
  it('message', () =>
    assert.equal(new TestError([msg]).message, `${message}${msg}`)
  );

  it('code', () =>
    assert.equal(new TestError([msg]).code, TestError.name)
  );

  it('meta', () =>
    assert.equal(new TestError([msg], meta).meta, meta)
  );
});
