import { expect } from 'vitest';
import { createReadStream } from 'fs';
import { stream } from '../src';

describe('stream', () => {
  it('load', async () =>
    expect(await stream.load(createReadStream(__filename))).toMatchSnapshot());
});
