import { SetMetadata } from '@nestjs/common';

/**
 * @description Metadata key used by {@link RolesGuardProvider} to store required roles.
 */
export const ROLES_KEY = Symbol('RolesKey');

/**
 * @description
 * Decorator that sets required user roles on a route handler.
 * Roles are combined via bitwise OR.
 *
 * @example
 * ```ts
 * @Roles(UserRoles.Admin, UserRoles.Manager)
 * ```
 */
export const Roles = (...roles: number[]) =>
  SetMetadata(
    ROLES_KEY,
    roles.reduce((memo, item) => {
      memo |= item;
      return memo;
    }, 0),
  );
