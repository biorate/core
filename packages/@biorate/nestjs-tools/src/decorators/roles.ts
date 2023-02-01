import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../enums';

export const ROLES_KEY = Symbol('RolesKey');

export const Roles = (...roles: UserRoles[]) =>
  SetMetadata(
    ROLES_KEY,
    roles.reduce((memo, item) => {
      memo |= item;
      return memo;
    }, 0),
  );
