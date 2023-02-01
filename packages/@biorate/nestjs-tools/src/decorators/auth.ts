import { UseGuards } from '@nestjs/common';
import { ApiBasicAuth } from '@nestjs/swagger';
import { AuthGuardProvider } from '../providers';

export const AuthBasic =
  () =>
  (
    target: Record<string | symbol, unknown>,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<unknown>,
  ) => {
    ApiBasicAuth()(target, propertyKey!, descriptor!);
    UseGuards(AuthGuardProvider)(target, propertyKey!, descriptor!);
  };
