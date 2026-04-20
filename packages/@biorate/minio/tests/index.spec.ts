import { expect } from 'vitest';
import { container } from '@biorate/inversion';
import { Root, root } from './__mocks__';

describe('@biorate/minio', () => {
  beforeAll(async () => await root.$run());

  it('makeBucket', async () => await root.connector!.current!.makeBucket('test', 'test'));

  it('putObject', async () =>
    await root.connector!.current!.putObject(
      'test',
      'test.file',
      Buffer.from('Hello world!'),
    ));

  it('getObject', () =>
    new Promise((done) => {
      let data = '';
      root.connector!.current!.getObject('test', 'test.file').then((stream) => {
        stream
          .on('data', (chunk: Buffer) => (data += chunk.toString('utf8')))
          .on('end', () => (expect(data).toMatchSnapshot(), done(void 0)));
      });
    }));

  it('removeObject', async () =>
    await root.connector!.current!.removeObjects('test', ['test.file']));

  it('removeBucket', async () => await root.connector!.current!.removeBucket('test'));
});
