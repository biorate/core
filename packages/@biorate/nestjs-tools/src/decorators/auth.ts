import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBasicAuth } from '@nestjs/swagger';
import { AuthGuardProvider } from '../providers';

/**
 * @description
 * Decorator that enables HTTP Basic Auth for a route handler.
 * Combines Swagger's `@ApiBasicAuth()` with NestJS's `@UseGuards(AuthGuardProvider)`.
 *
 * @example
 * ```ts
 * @AuthBasic()
 * ```
 */
export const AuthBasic = () =>
  applyDecorators(ApiBasicAuth(), UseGuards(AuthGuardProvider));
