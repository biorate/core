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

  it('getPing', async () => {
    const { ping } = root.connector.connection('connection');
    const { data } = await ping();
    expect(data).to.be.a('object');
  });

  it('postSubjectsVersions', async () => {
    const { postSubjectsVersions } = root.connector.connection('connection');
    const { data } = await postSubjectsVersions({ subject, schema });
    expect(data).to.has.property('id').that.be.a('number');
  });

  it('postSubjects', async () => {
    const { postSubjects } = root.connector.connection('connection');
    const { data } = await postSubjects({ subject, schema });
    expect(data).to.has.property('subject').that.be.a('string');
    expect(data).to.has.property('id').that.be.a('number');
    expect(data).to.has.property('version').that.be.a('number');
    expect(data).to.has.property('schema').that.be.a('string');
  });

  it('getSchemasById', async () => {
    const { getSchemasById } = root.connector.connection('connection');
    const { data } = await getSchemasById(1);
    expect(data).to.has.property('schema').that.be.a('string');
  });

  it('getSchemasTypes', async () => {
    const { getSchemasTypes } = root.connector.connection('connection');
    const { data } = await getSchemasTypes();
    expect(data).toMatchSnapshot();
  });

  it('getSchemasVersionsById', async () => {
    const { getSchemasVersionsById } = root.connector.connection('connection');
    const { data } = await getSchemasVersionsById(1);
    expect(data[0]).to.has.property('subject').that.be.a('string');
    expect(data[0]).to.has.property('version').that.be.a('number');
  });

  it('getSubjects', async () => {
    const { getSubjects } = root.connector.connection('connection');
    const { data } = await getSubjects();
    expect(data).toMatchSnapshot();
  });

  it('getSubjectsVersions', async () => {
    const { getSubjectsVersions } = root.connector.connection('connection');
    const { data } = await getSubjectsVersions(subject);
    expect(data[0]).to.be.a('number');
    [version] = data;
  });

  it('getSubjectsByVersion', async () => {
    const { getSubjectsByVersion } = root.connector.connection('connection');
    const { data } = await getSubjectsByVersion({
      subject,
      version,
    });
    expect(data).to.has.property('subject').that.be.a('string');
    expect(data).to.has.property('id').that.be.a('number');
    expect(data).to.has.property('version').that.be.a('number');
    expect(data).to.has.property('schema').that.be.a('string');
  });

  it('encode / decode', async () => {
    const { encode, decode } = root.connector.connection('connection');
    const data = { firstName: 'Vasya', lastName: 'Pupkin', age: 18 };
    const buffer = await encode(subject, data);
    const result = await decode(buffer);
    expect(JSON.parse(JSON.stringify(result))).to.be.deep.equal(data);
  });

  it('deleteSubjects', async () => {
    const { deleteSubjects } = root.connector.connection('connection');
    const { data } = await deleteSubjects({
      subject,
      permanent: false,
    });
    expect(data[0]).to.be.a('number');
  });
});
