import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBasicAuth } from '@nestjs/swagger';
import { AuthGuardProvider } from '../providers';

export const AuthBasic = () =>
  applyDecorators(ApiBasicAuth(), UseGuards(AuthGuardProvider));
