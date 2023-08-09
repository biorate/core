import {
  ArgumentsHost,
  Body,
  CallHandler,
  CanActivate,
  ExceptionFilter,
  ExecutionContext,
  Get,
  Header,
  NestInterceptor,
  NestMiddleware,
  Param,
  Post,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Observable } from 'rxjs';
import { Options, RequestHandler } from 'http-proxy-middleware/dist/types';
import { mkdirSync, promises as fs, readFileSync, writeFileSync } from 'fs';
import { path } from '@biorate/tools';
import { ApiOperation } from '@nestjs/swagger';
import { merge } from 'lodash';
import { inject, Types } from '@biorate/inversion';
import { IPrometheus } from '@biorate/prometheus';
import { ILocalesDTO } from './interfaces';

export * from './interfaces';

declare module '@biorate/nestjs-tools' {
  export class GetLocalesDTO implements ILocalesDTO {
    lang: string;
    namespace: string;
  }

  export class PostLocalesDTO extends GetLocalesDTO {}

  export function AuthBasic(): (
    target: any,
    propertyKey?: any,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => void;

  export function Roles(...roles: number[]): (<T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ) => TypedPropertyDescriptor<T> | void) &
    (<TFunction extends Function>(target: TFunction) => void | TFunction) & {
      KEY: symbol;
    };

  export class AllExceptionsFilter implements ExceptionFilter {
    public catch(exception: unknown, host: ArgumentsHost): void;

    protected log(exception: unknown): void;
  }

  export class RoutesInterceptor implements NestInterceptor {
    public static readonly map: WeakMap<Request, { path: string }>;

    public intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
  }

  export class ProxyPrometheusMiddleware {
    public static create(options?: Options): RequestHandler;
  }

  export class RequestCountMiddleware implements NestMiddleware {
    public use(req: Request, res: Response, next: NextFunction): void;
  }

  export class ResponseTimeMiddleware implements NestMiddleware {
    public use(req: Request, res: Response, next: NextFunction): void;
  }

  export class AuthGuardProvider implements CanActivate {
    public canActivate(context: ExecutionContext): boolean;
  }

  export class RolesGuardProvider implements CanActivate {
    public canActivate(context: ExecutionContext): boolean;
  }

  export class LocalesController {
    protected static async getFile(
      namespace: string,
      lang: string,
    ): Record<string, unknown>;

    protected static getFileSync(
      namespace: string,
      lang: string,
    ): Record<string, unknown>;

    protected static putFile(
      namespace: string,
      lang: string,
      data: Record<string, string>,
    ): void;

    protected get(param: GetLocalesDTO): Promise<Record<string, unknown>>;

    protected post(param: PostLocalesDTO, body: Record<string, string>): Promise<void>;
  }

  export class MetricsController {
    protected prometheus: IPrometheus;

    protected metrics(): Promise<string>;
  }

  export class ProbeController {
    protected readiness(): number;

    protected healthz(): number;
  }
}
