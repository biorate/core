import { AxiosError, AxiosResponse } from 'axios';
import { Axios } from '@biorate/axios';
import { IConfig } from '@biorate/config';
import { Counter, Histogram } from '@biorate/prometheus';

declare module '@biorate/axios-prometheus' {
  export abstract class AxiosPrometheus extends Axios {
    protected get config(): IConfig;

    protected counter: Counter;

    protected histogram: Histogram;

    public abstract baseURL: string;
    public abstract url: string;
    public abstract method: string;

    protected log(statusCode: number, startTime: [number, number]): void;

    protected after(result: AxiosResponse, startTime: [number, number]): Promise<void>;

    protected catch(e: Error | AxiosError, startTime: [number, number]): Promise<void>;
  }
}
