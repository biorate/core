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
  ContextType,
} from '@nestjs/common';
import { AxiosRequestError, UnsupportedProtocolError } from '../errors';

/**
 * @description
 * Global exception filter that catches all exceptions and returns a structured JSON response
 * with status, code, hint, path, and meta fields. Supports HTTP and WebSocket transports; RPC is
 * unsupported and throws {@link UnsupportedProtocolError}.
 *
 * @example
 * ```ts
 * app.useGlobalFilters(new AllExceptionsFilter());
 * ```
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  protected type: ContextType;

  protected exception: Error;

  protected host: ArgumentsHost;

  public catch(exception: Error, host: ArgumentsHost) {
    this.type = host.getType();
    this.exception = exception;
    this.host = host;
    const method = <`_${typeof this.type}`>`_${this.type}`;
    if (!this[method]) throw new UnsupportedProtocolError(this.type);
    this[method]();
  }

  private _http() {
    const ctx = this.host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const meta = (<BaseError>this.exception)?.meta;
    const status = this.httpStatus;
    this.log(this.exception);
    response.status(status).json(
      this.format({
        status,
        path: request.url,
        meta: meta?.meta,
      }),
    );
  }

  private _ws() {
    const ctx = this.host.switchToWs();
    const socket = ctx.getClient<WebSocket>();
    const meta = (<BaseError>this.exception)?.meta;
    this.log(this.exception);
    socket.send(
      JSON.stringify({
        event: 'error',
        data: this.format({
          status: this.wsStatus,
          meta: meta?.meta,
        }),
      }),
    );
  }

  private _rpc() {
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

  protected get httpStatus() {
    return this.exception instanceof HttpException
      ? this.exception.getStatus()
      : (<BaseError>this.exception)?.meta?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }

  protected get wsStatus() {
    return (<BaseError>this.exception)?.meta?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }

  protected format(data: Record<string, unknown>): Record<string, unknown> {
    return {
      code: this.code(this.exception),
      hint: this.hint(this.exception),
      ...data,
    };
  }

  protected log(exception: Error) {
    if (exception instanceof AxiosError)
      console.error(
        new AxiosRequestError(
          exception?.response?.data?.statusCode ?? exception.status,
          exception?.response?.data?.error ?? exception.code,
          exception?.response?.data?.message ?? exception.message,
        ).stack,
      );
    else console.error(exception.stack);
  }
}
