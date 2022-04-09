import { Axios } from '@biorate/axios';
import { ISchemaRegistryConfig } from './interfaces';

export const create = (config: ISchemaRegistryConfig) => {
  class SchemaRegistryApi extends Axios {
    public baseURL = config.baseURL;
  }

  class GetSchemasById extends SchemaRegistryApi {
    public url = '/schemas/ids/:id';
    public method = 'get';
  }

  class GetSchemasTypes extends SchemaRegistryApi {
    public url = '/schemas/types';
    public method = 'get';

    public static async fetch<T = string[], D = any>(options?) {
      return super.fetch<T, D>(options);
    }
  }

  class GetSchemasVersionsById extends SchemaRegistryApi {
    public url = '/schemas/ids/:id/versions';
    public method = 'get';
  }

  class GetSubjects extends SchemaRegistryApi {
    public url = '/subjects';
    public method = 'get';
  }

  class GetSubjectsVersions extends SchemaRegistryApi {
    public url = '/subjects/:subject/versions';
    public method = 'get';
  }

  return {
    SchemaRegistryApi,
    GetSchemasById,
    GetSchemasTypes,
    GetSchemasVersionsById,
    GetSubjects,
    GetSubjectsVersions,
  };
};
