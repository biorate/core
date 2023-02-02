import {
  ArgumentsHost,
  CallHandler,
  CanActivate,
  ExceptionFilter,
  ExecutionContext,
  NestInterceptor,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Observable } from 'rxjs';
import { Options, RequestHandler } from 'http-proxy-middleware/dist/types';
import { UserRoles } from './src/enums';

declare module '@biorate/nestjs-tools' {
  export function AuthBasic(): (
    target: any,
    propertyKey?: any,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => void;

  export function Roles(...roles: UserRoles[]): (<T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ) => TypedPropertyDescriptor<T> | void) &
    (<TFunction extends Function>(target: TFunction) => void | TFunction) & {
      KEY: symbol;
    };

  export * from './src/enums';

  export class AllExceptionsFilter implements ExceptionFilter {
    public catch(exception: unknown, host: ArgumentsHost): void;
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
}
