import { expect } from 'chai';
import { container } from '@biorate/inversion';
import { Root } from './__mocks__';
import * as schema from './test.avsc.json';

describe('@biorate/schema-registry', function () {
  let root: Root,
    version: number,
    subject = 'test';
  this.timeout(3e4);

  before(async () => {
    root = container.get<Root>(Root);
    await root.$run();
  });

  it('GetPing', async () => {
    const { GetPing } = root.connector.connection('connection');
    const { data } = await GetPing.fetch();
    expect(data).to.be.a('object');
  });

  it('PostSubjectsVersions', async () => {
    const { PostSubjectsVersions } = root.connector.connection('connection');
    const { data } = await PostSubjectsVersions.fetch({ subject, schema });
    expect(data).to.has.property('id').that.be.a('number');
  });

  it('PostSubjects', async () => {
    const { PostSubjects } = root.connector.connection('connection');
    const { data } = await PostSubjects.fetch({ subject, schema });
    expect(data).to.has.property('subject').that.be.a('string');
    expect(data).to.has.property('id').that.be.a('number');
    expect(data).to.has.property('version').that.be.a('number');
    expect(data).to.has.property('schema').that.be.a('string');
  });

  it('GetSchemasById', async () => {
    const { GetSchemasById } = root.connector.connection('connection');
    const { data } = await GetSchemasById.fetch(1);
    expect(data).to.has.property('schema').that.be.a('string');
  });

  it('GetSchemasTypes', async () => {
    const { GetSchemasTypes } = root.connector.connection('connection');
    const { data } = await GetSchemasTypes.fetch();
    expect(data).toMatchSnapshot();
  });

  it('GetSchemasVersionsById', async () => {
    const { GetSchemasVersionsById } = root.connector.connection('connection');
    const { data } = await GetSchemasVersionsById.fetch(1);
    expect(data[0]).to.has.property('subject').that.be.a('string');
    expect(data[0]).to.has.property('version').that.be.a('number');
  });

  it('GetSubjects', async () => {
    const { GetSubjects } = root.connector.connection('connection');
    const { data } = await GetSubjects.fetch();
    expect(data).toMatchSnapshot();
  });

  it('GetSubjectsVersions', async () => {
    const { GetSubjectsVersions } = root.connector.connection('connection');
    const { data } = await GetSubjectsVersions.fetch(subject);
    expect(data[0]).to.be.a('number');
    [version] = data;
  });

  it('GetSubjectsByVersion', async () => {
    const { GetSubjectsByVersion } = root.connector.connection('connection');
    const { data } = await GetSubjectsByVersion.fetch({
      subject,
      version,
    });
    expect(data).to.has.property('subject').that.be.a('string');
    expect(data).to.has.property('id').that.be.a('number');
    expect(data).to.has.property('version').that.be.a('number');
    expect(data).to.has.property('schema').that.be.a('string');
  });

  it('DeleteSubjects', async () => {
    const { DeleteSubjects } = root.connector.connection('connection');
    const { data } = await DeleteSubjects.fetch({
      subject,
      permanent: false,
    });
    expect(data[0]).to.be.a('number');
  });
});
