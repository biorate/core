import { expect } from 'chai';
import { container } from '@biorate/inversion';
import { Root } from './__mocks__';

describe('@biorate/schema-registry', function () {
  let root: Root;
  this.timeout(3e4);

  before(async () => {
    root = container.get<Root>(Root);
    await root.$run();
  });

  it('GetSchemasById', async () => {
    const { GetSchemasById } = root.connector.connection('connection');
    const { data } = await GetSchemasById.fetch(1);
  });

  it('GetSchemasTypes', async () => {
    const { GetSchemasTypes } = root.connector.connection('connection');
    const { data } = await GetSchemasTypes.fetch();
  });

  it('GetSchemasVersionsById', async () => {
    const { GetSchemasVersionsById } = root.connector.connection('connection');
    const { data } = await GetSchemasVersionsById.fetch(1);
  });

  it('GetSubjects', async () => {
    const { GetSubjects } = root.connector.connection('connection');
    const { data } = await GetSubjects.fetch();
  });

  it('GetSubjectsVersions', async () => {
    const { GetSubjectsVersions } = root.connector.connection('connection');
    const { data } = await GetSubjectsVersions.fetch(
      'receiptrep-debug-canonical-int-receipts-receipt-v5-value',
    );
  });

  it.skip('DeleteSubjects', async () => {
    const { DeleteSubjects } = root.connector.connection('connection');
    const { data } = await DeleteSubjects.fetch({
      subject: 'receiptrep-debug-canonical-int-receipts-receipt-v5-value',
      permanent: false,
    });
  });

  it.only('GetSubjectsByVersion', async () => {
    const { GetSubjectsByVersion } = root.connector.connection('connection');
    const { data } = await GetSubjectsByVersion.fetch({
      subject: 'receiptrep-debug-canonical-int-receipts-receipt-v5-value',
      version: 1,
    });
    console.log(data);
  });

});
