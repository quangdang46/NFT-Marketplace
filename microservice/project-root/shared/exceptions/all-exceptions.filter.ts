import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { BaseExceptionFilter, HttpAdapterHost } from "@nestjs/core";
import { Logger } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(httpAdapterHost: HttpAdapterHost) {
    super(httpAdapterHost.httpAdapter);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal Server Error";

    this.logger.error(
      `❌ ${request.method} ${request.url} - Status: ${status}`,
      JSON.stringify({ message, exception })
    );

    response.status(status).json({
      statusCode: status,
      message:
        typeof message === "string"
          ? message
          : (message as any).message || message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
