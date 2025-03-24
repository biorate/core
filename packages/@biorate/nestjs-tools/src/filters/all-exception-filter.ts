import { AxiosError } from '@biorate/axios';
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
import { AxiosRequestError, UnsupportedProtocolError } from '../errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  public catch(exception: Error, host: ArgumentsHost) {
    const type = host.getType();
    const method = <`_${typeof type}`>`_${type}`;
    if (!this[method]) throw new UnsupportedProtocolError(host.getType());
    this[method](exception, host);
  }

  private _http(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const meta = (exception as BaseError)?.meta;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : meta?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    this.log(exception);
    response.status(status).json({
      status,
      code: this.code(exception),
      hint: this.hint(exception),
      path: request.url,
      meta: meta?.meta,
    });
  }

  private _ws(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const socket = ctx.getClient<WebSocket>();
    const meta = (exception as BaseError)?.meta;
    const status = meta?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    this.log(exception);
    socket.send(
      //TODO: add serializers factory
      JSON.stringify({
        event: 'error',
        data: {
          status,
          code: this.code(exception),
          hint: this.hint(exception),
          meta: meta?.meta,
        },
      }),
    );
  }

  private _rpc(exception: Error, host: ArgumentsHost) {
    throw new UnsupportedProtocolError('rpc');
  }

  private code(exception: Error) {
    return (<BaseError>exception).code ?? exception.constructor.name;
  }

  private hint(exception: Error) {
    return (
      (
        (<BadRequestException>exception)?.getResponse?.() as {
          message?: [string];
        }
      )?.message ?? (<BaseError>exception).message
    );
  }

  protected log(exception: Error) {
    if (exception instanceof AxiosError)
      console.error(
        new AxiosRequestError(
          exception?.response?.data?.statusCode,
          exception?.response?.data?.error,
          exception?.response?.data?.message,
        ),
      );
    else console.error(exception.stack);
  }
}
