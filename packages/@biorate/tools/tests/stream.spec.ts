import { expect, use } from 'chai';
import { createReadStream } from 'fs';
import { stream } from '../src';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';

use(jestSnapshotPlugin());

describe('stream', () => {
  it('load', async () =>
    expect(await stream.load(createReadStream(__filename))).toMatchSnapshot());
});
