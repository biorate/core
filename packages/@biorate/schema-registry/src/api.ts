import { Axios } from '@biorate/axios';
import { Type } from 'avsc';
import { Schemas } from './cache';
import { ISchemaRegistryConfig } from './interfaces';

export const create = (config: ISchemaRegistryConfig) => {
  const cache = new Schemas();

  class SchemaRegistryApi extends Axios {
    public baseURL = config.baseURL;
  }

  class GetPing extends SchemaRegistryApi {
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
            schema:
              typeof data.schema === 'string' ? data.schema : JSON.stringify(data.schema),
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
    let data = cache.find(id);
    if (!data) {
      const response = await GetSchemasById.fetch(id);
      data = { id, schema: Type.forSchema(JSON.parse(response.data.schema)) };
      cache.set(data);
    }
    const schema = Type.forSchema(data.schema);
    return schema.fromBuffer(buffer.slice(5));
  }

  function toStringData(data: string | Record<string, any>) {
    return typeof data === 'string' ? data : JSON.stringify(data);
  }

  return {
    GetPing,
    GetSchemasById,
    GetSchemasTypes,
    GetSchemasVersionsById,
    GetSubjects,
    GetSubjectsVersions,
    DeleteSubjects,
    GetSubjectsByVersion,
    GetSchemaBySubjectsAndVersion,
    PostSubjects,
    PostSubjectsVersions,
    encode,
    decode,
  };
};
