import { IConnector, IConnectorConfig } from '@biorate/connector';
import { ApiResponse, Client, ClientOptions } from '@opensearch-project/opensearch';

/** @description OpenSearch connector type. */
export type IOpenSearchConnector = IConnector<IOpenSearchConfig, IOpenSearchConnection>;
/** @description OpenSearch connection type (aliases the `@opensearch-project/opensearch` Client class). */
export type IOpenSearchConnection = Client;
/** @description OpenSearch API response type (aliases `@opensearch-project/opensearch` ApiResponse). */
export type IOpenSearchApiResponse = ApiResponse;

/** @description Configuration interface for OpenSearch connector. */
export interface IOpenSearchConfig extends IConnectorConfig {
  options: ClientOptions;
}
