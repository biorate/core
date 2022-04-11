import { Axios } from '@biorate/axios';
import { Type } from 'avsc';
import { ISchemaRegistryConfig } from './interfaces';

export const create = (config: ISchemaRegistryConfig) => {
  const cache = new Map<number, Type>();

  class SchemaRegistryApi extends Axios {
    public baseURL = config.baseURL;
  }

  class Ping extends SchemaRegistryApi {
    public url = '/';
    public method = 'get';

    public static fetch(...args) {
      return this._fetch<{}>({}, ...args);
    }
  }

  class GetSchemasById extends SchemaRegistryApi {
    public url = '/schemas/ids/:id';
    public method = 'get';

    public static fetch(id: number, ...args) {
      return this._fetch<{ schema: string }>({ path: { id } }, ...args);
    }
  }

  class GetSchemasTypes extends SchemaRegistryApi {
    public url = '/schemas/types';
    public method = 'get';

    public static fetch(...args) {
      return this._fetch<string[]>({}, ...args);
    }
  }

  class GetSchemasVersionsById extends SchemaRegistryApi {
    public url = '/schemas/ids/:id/versions';
    public method = 'get';

    public static fetch(id: number, ...args) {
      return this._fetch<{ subject: string; version: number }[]>(
        { path: { id } },
        ...args,
      );
    }
  }

  class GetSubjects extends SchemaRegistryApi {
    public url = '/subjects';
    public method = 'get';

    public static fetch(...args) {
      return this._fetch<string[]>({}, ...args);
    }
  }

  class GetSubjectsVersions extends SchemaRegistryApi {
    public url = '/subjects/:subject/versions';
    public method = 'get';

    public static fetch(subject: string, ...args) {
      return this._fetch<number[]>({ path: { subject } }, ...args);
    }
  }

  class DeleteSubjects extends SchemaRegistryApi {
    public url = '/subjects/:subject';
    public method = 'delete';

    public static fetch(data: { subject: string; permanent?: boolean }, ...args) {
      return this._fetch<number[]>(
        { path: { subject: data.subject }, params: { permanent: !!data.permanent } },
        ...args,
      );
    }
  }

  class GetSubjectsByVersion extends SchemaRegistryApi {
    public url = '/subjects/:subject/versions/:version';
    public method = 'get';

    public static fetch(data: { subject: string; version: number | string }, ...args) {
      return this._fetch<{
        subject: string;
        id: number;
        version: number;
        schemaType: string;
        schema: string;
      }>({ path: data }, ...args);
    }
  }

  class GetSchemaBySubjectsAndVersion extends SchemaRegistryApi {
    public url = '/subjects/:subject/versions/:version/schema';
    public method = 'get';

    public static fetch(data: { subject: string; version: number | string }, ...args) {
      return this._fetch<unknown>({ path: data }, ...args);
    }
  }

  class PostSubjectsVersions extends SchemaRegistryApi {
    public url = '/subjects/:subject/versions';
    public method = 'post';

    public static fetch(
      data: {
        subject: string;
        schema: string | Record<string, any>;
        schemaType?: string;
        reference?: string;
        normalize?: boolean;
      },
      ...args
    ) {
      return this._fetch<{ id: number }>(
        {
          path: { subject: data.subject },
          params: { normalize: !!data.normalize },
          data: {
            schema: toStringData(data.schema),
            schemaType: data.schemaType,
            reference: data.reference,
          },
        },
        ...args,
      );
    }
  }

  class PostSubjects extends SchemaRegistryApi {
    public url = '/subjects/:subject';
    public method = 'post';

    public static fetch(
      data: {
        subject: string;
        schema: string | Record<string, any>;
        schemaType?: string;
        reference?: string;
        normalize?: boolean;
      },
      ...args
    ) {
      return this._fetch<{
        subject: string;
        id: number;
        version: number;
        schema: string;
      }>(
        {
          path: { subject: data.subject },
          params: { normalize: !!data.normalize },
          data: {
            schema: toStringData(data.schema),
            schemaType: data.schemaType,
            reference: data.reference,
          },
        },
        ...args,
      );
    }
  }

  async function encode(
    subject: string,
    data: Record<string, any>,
    version: string | number = 'latest',
  ) {
    const response = await GetSubjectsByVersion.fetch({ subject, version });
    const header = Buffer.alloc(5);
    const schema = Type.forSchema(JSON.parse(response.data.schema));
    header.writeInt32BE(response.data.id, 1);
    return Buffer.concat([header, schema.toBuffer(data)]);
  }

  async function decode(buffer: Buffer) {
    const id = buffer.readInt32BE(1);
    let data: Type = cache.get(id);
    if (!data) {
      const response = await GetSchemasById.fetch(id);
      data = Type.forSchema(JSON.parse(response.data.schema));
      cache.set(id, data);
    }
    const schema = Type.forSchema(data);
    return schema.fromBuffer(buffer.slice(5));
  }

  function toStringData(data: string | Record<string, any>) {
    return typeof data === 'string' ? data : JSON.stringify(data);
  }

  return {
    ping: <typeof Ping.fetch>Ping.fetch.bind(Ping),
    getSchemasById: <typeof GetSchemasById.fetch>(
      GetSchemasById.fetch.bind(GetSchemasById)
    ),
    getSchemasTypes: <typeof GetSchemasTypes.fetch>(
      GetSchemasTypes.fetch.bind(GetSchemasTypes)
    ),
    getSchemasVersionsById: <typeof GetSchemasVersionsById.fetch>(
      GetSchemasVersionsById.fetch.bind(GetSchemasVersionsById)
    ),
    getSubjects: <typeof GetSubjects.fetch>GetSubjects.fetch.bind(GetSubjects),
    getSubjectsVersions: <typeof GetSubjectsVersions.fetch>(
      GetSubjectsVersions.fetch.bind(GetSubjectsVersions)
    ),
    deleteSubjects: <typeof DeleteSubjects.fetch>(
      DeleteSubjects.fetch.bind(DeleteSubjects)
    ),
    getSubjectsByVersion: <typeof GetSubjectsByVersion.fetch>(
      GetSubjectsByVersion.fetch.bind(GetSubjectsByVersion)
    ),
    getSchemaBySubjectsAndVersion: <typeof GetSchemaBySubjectsAndVersion.fetch>(
      GetSchemaBySubjectsAndVersion.fetch.bind(GetSchemaBySubjectsAndVersion)
    ),
    postSubjects: <typeof PostSubjects.fetch>PostSubjects.fetch.bind(PostSubjects),
    postSubjectsVersions: <typeof PostSubjectsVersions.fetch>(
      PostSubjectsVersions.fetch.bind(PostSubjectsVersions)
    ),
    encode,
    decode,
  };
};
