import { IConnector, IConnectorConfig } from '@biorate/connector';
import { ApiResponse, Client, ClientOptions } from '@opensearch-project/opensearch';

export type IOpenSearchConnector = IConnector<IOpenSearchConfig, IOpenSearchConnection>;
export type IOpenSearchConnection = Client;
export type IOpenSearchApiResponse = ApiResponse;

export interface IOpenSearchConfig extends IConnectorConfig {
  options: ClientOptions;
}
