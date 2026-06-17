import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { setup, teardown, subject } from './__mocks__/schema-registry';
import * as schema from './__mocks__/test.avsc.json';

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
    expect(pingResult.data).toEqual(expect.any(Object));

    const { postSubjectsVersions } = connection;
    const { data: versionData } = await postSubjectsVersions({ subject, schema });
    expect(versionData).toHaveProperty('id', expect.any(Number));

    await new Promise((resolve) => setTimeout(resolve, 100));

    const { getSubjectsByVersion } = connection;
    const { data: schemaData } = await getSubjectsByVersion({
      subject,
      version: 'latest',
    });
    expect(schemaData).toHaveProperty('subject', expect.any(String));
    expect(schemaData).toHaveProperty('id', expect.any(Number));
    expect(schemaData).toHaveProperty('version', expect.any(Number));
    expect(schemaData).toHaveProperty('schema', expect.any(String));

    const { getSchemasById } = connection;
    const { data: schemaById } = await getSchemasById(versionData.id);
    expect(schemaById).toHaveProperty('schema', expect.any(String));

    const { getSubjects } = connection;
    const { data: subjects } = await getSubjects();
    expect(subjects).toBeInstanceOf(Array);

    const { getSubjectsVersions } = connection;
    const { data: versions } = await getSubjectsVersions(subject);
    expect(versions).toBeInstanceOf(Array);

    const { getSchemasTypes } = connection;
    const { data: types } = await getSchemasTypes();
    expect(types).toBeInstanceOf(Array);

    const { deleteSubjects } = connection;
    const { data: deleted } = await deleteSubjects({
      subject,
      permanent: false,
    });
    expect(deleted[0]).toEqual(expect.any(Number));
  });
});
