import { expect, use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
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
} from '../src';

use(jestSnapshotPlugin());

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
});
