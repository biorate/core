import { BaseError } from '@biorate/errors';
import { WebSocket } from 'ws';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UnsupportedProtocolError } from '../errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost) {
    const type = host.getType();
    const method = <`_${typeof type}`>`_${type}`;
    if (!this[method]) throw new UnsupportedProtocolError(host.getType());
    this[method](exception, host);
  }

  private _http(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (exception as BaseError)?.meta?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    this.log(exception);
    response.status(status).json({
      status,
      code: this.code(exception),
      hint: this.hint(exception),
      path: request.url,
    });
  }

  private _ws(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const socket = ctx.getClient<WebSocket>();
    const status =
      (exception as BaseError)?.meta?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    this.log(exception);
    socket.send(
      //TODO: add serializers factory
      JSON.stringify({
        event: 'error',
        data: { status, code: this.code(exception), hint: this.hint(exception) },
      }),
    );
  }

  private _rpc(exception: unknown, host: ArgumentsHost) {
    throw new UnsupportedProtocolError('rpc');
  }

  private code(exception: unknown) {
    return (<BaseError>exception).code ?? (<Error>exception).constructor.name;
  }

  private hint(exception: unknown) {
    return (
      (
        (<BadRequestException>exception)?.getResponse?.() as unknown as {
          message?: [string];
        }
      )?.message ?? (<BaseError>exception).message
    );
  }

  protected log(exception: unknown) {
    console.error(exception);
  }
}
