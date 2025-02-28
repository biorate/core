import { expect } from 'chai';
import { container } from '@biorate/inversion';
import { Root } from './__mocks__';

describe('@biorate/minio', function () {
  let root: Root;
  this.timeout(3e4);

  before(async () => {
    root = container.get<Root>(Root);
    await root.$run();
  });

  it('makeBucket', async () => await root.connector!.current!.makeBucket('test', 'test'));

  it('putObject', async () =>
    await root.connector!.current!.putObject(
      'test',
      'test.file',
      Buffer.from('Hello world!'),
    ));

  it('getObject', (done) => {
    root.connector!.current!.getObject('test', 'test.file', (e: any, stream: any) => {
      let data = '';
      stream
        .on('data', (chunk: Buffer) => (data += chunk.toString('utf8')))
        .on('end', () => (expect(data).toMatchSnapshot(), done()));
    });
  });

  it('removeObject', async () =>
    await root.connector!.current!.removeObjects('test', ['test.file']));

  it('removeBucket', async () => await root.connector!.current!.removeBucket('test'));
});
