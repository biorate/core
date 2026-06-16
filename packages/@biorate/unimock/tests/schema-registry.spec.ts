import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { SnapshotStore, MODE_REPLAY } from '../src';
import { SchemaRegistryConnector } from './__mocks__/schema-registry';
import * as schema from './test.avsc.json';

beforeAll(() => {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
});

afterAll(() => {
  for (const c of [SchemaRegistryConnector])
    if (container.isBound(c)) container.unbind(c);
});

describe('@biorate/schema-registry', () => {
  const subject = 'unimock-test-subject';

  it('schema-registry connector', async () => {
    container.get<IConfig>(Types.Config).merge({
      SchemaRegistry: [{ name: 'connection', baseURL: 'http://localhost:8085' }],
    });

    container.bind(SchemaRegistryConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(SchemaRegistryConnector) public connector: SchemaRegistryConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const connection = root.connector.connection('connection');

    const { ping } = connection;
    const pingResult = await ping();
    expect(pingResult.data).to.be.a('object');

    const { postSubjectsVersions } = connection;
    const { data: versionData } = await postSubjectsVersions({ subject, schema });
    expect(versionData).to.has.property('id').that.be.a('number');

    // Небольшая задержка для репликации в schema registry
    await new Promise(resolve => setTimeout(resolve, 100));

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

    // deleteSubjects вызываем только в record-режиме
    if (SnapshotStore.mode !== MODE_REPLAY) {
      const { deleteSubjects } = connection;
      const { data: deleted } = await deleteSubjects({
        subject,
        permanent: false,
      });
      expect(deleted[0]).to.be.a('number');
    }

    container.unbind(Root);
  });
});
