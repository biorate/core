import { join, normalize } from 'path/posix';
import { Reflector } from '@nestjs/core';
import { PATH_METADATA } from '@nestjs/common/constants';
import { Request } from 'express';
import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class RoutesInterceptor implements NestInterceptor {
  // Keep declaration output portable (avoid exporting express' deep generic types).
  public static readonly map: WeakMap<object, { path: string }> = new WeakMap();

  private readonly reflector = new Reflector();

  public intercept(context: ExecutionContext, next: CallHandler) {
    const namespaces = this.reflector.get<string | string[]>(
      PATH_METADATA,
      context.getClass(),
    );
    const routes = this.reflector.get<string | string[]>(
      PATH_METADATA,
      context.getHandler(),
    );
    RoutesInterceptor.map.set(context.switchToHttp().getRequest() as unknown as object, {
      path: normalize(
        join(
          '/',
          Array.isArray(namespaces) ? namespaces[0] : namespaces,
          Array.isArray(routes) ? routes[0] : routes,
          '/',
        ).slice(0, -1),
      ),
    });
    return next.handle();
  }
}
