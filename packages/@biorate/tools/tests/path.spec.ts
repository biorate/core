import { assert } from 'vitest';
import { path } from '../src';
import { file } from './__mocks__/path';

describe('path', () => {
  it('dirname not full', () => assert.equal(path.dirname(file), 'root'));

  it('dirname full', () => assert.equal(path.dirname(file, true), '/www/root'));

  it('basename without ext', () => assert.equal(path.basename(file), 'test'));

  it('basename with ext', () => assert.equal(path.basename(file, '.ts'), 'test.js'));

  it('extname', () => assert.equal(path.extname(file), '.js'));

  it('create', () => assert.equal(path.create('/www', 'root/', '', '/test.js', ''), file));
});
