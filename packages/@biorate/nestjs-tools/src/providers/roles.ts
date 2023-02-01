import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { UserRoles } from '../enums';

@Injectable()
export class RolesGuardProvider implements CanActivate {
  constructor(private reflector: Reflector) {}
  /**
   * @description - This method for override
   * @example
   * ```ts
   * const request = context.switchToHttp().getRequest();
   * const { login, sessionId } = request.cookies;
   * if (!login || !sessionId) throw new AuthorizationNotAuthorizedError();
   * // get user from db, or somewhere else
   * if (!user) throw new AuthorizationNotAuthorizedError();
   * return user.role;
   * ```
   */
  protected async getUser(context: ExecutionContext) {
    return { role: UserRoles.Basic | UserRoles.Admin };
  }

  public async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<number>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles === undefined) return true;
    const user = await this.getUser(context);
    return (user.role & roles) === roles;
  }
}
