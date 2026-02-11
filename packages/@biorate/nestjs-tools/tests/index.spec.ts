import { expect } from 'vitest';
import {
  AuthBasic,
  Roles,
  UserRoles,
  AllExceptionsFilter,
  RoutesInterceptor,
  ProxyPrometheusMiddleware,
  RequestCountMiddleware,
  ResponseTimeMiddleware,
  AuthGuardProvider,
  RolesGuardProvider,
  LocalesController,
  MetricsController,
  ProbeController,
  PostLocalesDTO,
  GetLocalesDTO,
  UnsupportedProtocolError,
  TracingInterceptor,
  ROLES_KEY,
} from '../src';

describe('nestjs-tools', () => {
  it('AuthBasic', () => expect(AuthBasic).toMatchSnapshot());

  it('Roles', () => expect(Roles).toMatchSnapshot());

  it('UserRoles', () => expect(UserRoles).toMatchSnapshot());

  it('AllExceptionsFilter', () => expect(AllExceptionsFilter).toMatchSnapshot());

  it('RoutesInterceptor', () => expect(RoutesInterceptor).toMatchSnapshot());

  it('ProxyPrometheusMiddleware', () =>
    expect(ProxyPrometheusMiddleware).toMatchSnapshot());

  it('RequestCountMiddleware', () => expect(RequestCountMiddleware).toMatchSnapshot());

  it('ResponseTimeMiddleware', () => expect(ResponseTimeMiddleware).toMatchSnapshot());

  it('AuthGuardProvider', () => expect(AuthGuardProvider).toMatchSnapshot());

  it('RolesGuardProvider', () => expect(RolesGuardProvider).toMatchSnapshot());

  it('LocalesController', () => expect(LocalesController).toMatchSnapshot());

  it('MetricsController', () => expect(MetricsController).toMatchSnapshot());

  it('ProbeController', () => expect(ProbeController).toMatchSnapshot());

  it('PostLocalesDTO', () => expect(PostLocalesDTO).toMatchSnapshot());

  it('GetLocalesDTO', () => expect(GetLocalesDTO).toMatchSnapshot());

  it('UnsupportedProtocolError', () =>
    expect(UnsupportedProtocolError).toMatchSnapshot());

  it('TracingInterceptor', () => expect(TracingInterceptor).toMatchSnapshot());

  it('ROLES_KEY', () => expect(ROLES_KEY).toMatchSnapshot());
});
