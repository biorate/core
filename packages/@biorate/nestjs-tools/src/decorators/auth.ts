import { UseGuards } from '@nestjs/common';
import { ApiBasicAuth } from '@nestjs/swagger';
import { AuthGuardProvider } from '../providers';

export const AuthBasic =
  () => (target: any, propertyKey?: any, descriptor?: TypedPropertyDescriptor<any>) => {
    ApiBasicAuth()(target, propertyKey!, descriptor!);
    UseGuards(AuthGuardProvider)(target, propertyKey!, descriptor!);
  };
