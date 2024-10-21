import { IConnector, IConnectorConfig } from '@biorate/connector';
import { ApiResponse, Client, ClientOptions } from '@opensearch-project/opensearch';

export type IElasticConnector = IConnector<IElasticConfig, IElasticConnection>;
export type IElasticConnection = Client;
export type IElasticApiResponse = ApiResponse;

export interface IElasticConfig extends IConnectorConfig {
  options: ClientOptions;
}
