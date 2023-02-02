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
  public static readonly map = new WeakMap<Request, { path: string }>();

  private readonly reflector = new Reflector();

  public intercept(context: ExecutionContext, next: CallHandler) {
    RoutesInterceptor.map.set(context.switchToHttp().getRequest(), {
      path: normalize(
        join(
          '/',
          this.reflector.get<string>(PATH_METADATA, context.getClass()),
          this.reflector.get<string>(PATH_METADATA, context.getHandler()),
        ),
      ),
    });
    return next.handle();
  }
}
