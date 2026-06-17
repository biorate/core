import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { setup, teardown, subject } from './__mocks__/schema-registry';
import * as schema from './test.avsc.json';

let root: Awaited<ReturnType<typeof setup>>;

beforeAll(async () => {
  root = await setup();
});

afterAll(() => {
  teardown();
});

describe('@biorate/schema-registry', () => {
  it('schema-registry connector', async () => {
    const connection = root.connector.connection('connection');

    const { ping } = connection;
    const pingResult = await ping();
    expect(pingResult.data).to.be.a('object');

    const { postSubjectsVersions } = connection;
    const { data: versionData } = await postSubjectsVersions({ subject, schema });
    expect(versionData).to.has.property('id').that.be.a('number');

    await new Promise((resolve) => setTimeout(resolve, 100));

    const { getSubjectsByVersion } = connection;
    const { data: schemaData } = await getSubjectsByVersion({
      subject,
      version: 'latest',
    });
    expect(schemaData).to.has.property('subject').that.be.a('string');
    expect(schemaData).to.has.property('id').that.be.a('number');
    expect(schemaData).to.has.property('version').that.be.a('number');
    expect(schemaData).to.has.property('schema').that.be.a('string');

    const { getSchemasById } = connection;
    const { data: schemaById } = await getSchemasById(versionData.id);
    expect(schemaById).to.has.property('schema').that.be.a('string');

    const { getSubjects } = connection;
    const { data: subjects } = await getSubjects();
    expect(subjects).to.be.an('array');

    const { getSubjectsVersions } = connection;
    const { data: versions } = await getSubjectsVersions(subject);
    expect(versions).to.be.an('array');

    const { getSchemasTypes } = connection;
    const { data: types } = await getSchemasTypes();
    expect(types).to.be.an('array');

    const { deleteSubjects } = connection;
    const { data: deleted } = await deleteSubjects({
      subject,
      permanent: false,
    });
    expect(deleted[0]).to.be.a('number');
  });
});
