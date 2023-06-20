import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = Symbol('RolesKey');

export const Roles = (...roles: number[]) =>
  SetMetadata(
    ROLES_KEY,
    roles.reduce((memo, item) => {
      memo |= item;
      return memo;
    }, 0),
  );
