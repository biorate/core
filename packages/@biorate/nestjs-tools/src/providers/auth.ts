import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuardProvider implements CanActivate {
  @inject(Types.Config) private config: IConfig;

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const config = this.config.get<{ [key: string]: string } | void>(
      'app.auth.basic',
      undefined,
    );
    if (!config) return true;
    let username: string, password: string;
    try {
      [username, password] = Buffer.from(
        request.headers.authorization.replace('Basic ', ''),
        'base64',
      )
        .toString('utf-8')
        .split(':');
    } catch {
      throw new UnauthorizedException();
    }
    if (!username || !password) throw new UnauthorizedException();
    if (config[username] === password) return true;
    throw new UnauthorizedException();
  }
}
