
import { Injectable, Inject } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { Response } from 'express';
import { ServiceDiscovery } from '../config/service-discovery.config';
import { Logger } from '@nestjs/common';
import {
  COOKIE_EXPIRES_IN,
  COOKIE_REFRESH_TOKEN_EXPIRES_IN,
  ConfigService,
} from '@project/shared';

@Injectable()
export class GatewayService {
  private clients: { [key: string]: ClientProxy } = {};
  private readonly logger = new Logger(GatewayService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly serviceDiscovery: ServiceDiscovery,
  ) {
    this.initializeClients();
  }

  private async initializeClients() {
    const services = ['auth-service', 'user-service'];
    const rabbitMqUrl = this.configService.get<string>(
      'RABBITMQ_URL',
      'amqp://rabbitmq:5672',
    );

    for (const service of services) {
      try {
        const queue = await this.serviceDiscovery.getServiceQueue(service);
        this.clients[service] = ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [rabbitMqUrl],
            queue,
            queueOptions: { durable: false },
            retryAttempts: 3, // Đúng thuộc tính của RmqOptions
            retryDelay: 1000, // Đúng thuộc tính của RmqOptions
          } as RmqOptions['options'], // Ép kiểu để khớp type
        });
        this.logger.log(
          `Initialized client for ${service} with queue: ${queue}`,
        );
      } catch (error) {
        this.logger.error(`Failed to initialize client for ${service}`, error);
      }
    }
  }

  /**
   * Gửi request tới microservice với retry logic
   */
  async sendToService<T>(service: string, pattern: any, data: any): Promise<T> {
    if (!this.clients[service]) {
      throw new Error(`Service ${service} not configured`);
    }

    try {
      const result = await this.clients[service]
        .send(pattern, data)
        .toPromise();
      return result;
    } catch (error) {
      this.logger.error(`Failed to send to ${service}`, error);
      throw new Error(`Service ${service} unavailable`);
    }
  }

  saveTokenToCookie(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('auth_token', accessToken, {
      maxAge: COOKIE_EXPIRES_IN,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.cookie('refresh_token', refreshToken, {
      maxAge: COOKIE_REFRESH_TOKEN_EXPIRES_IN,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  removeTokenFromCookie(res: Response) {
    res.clearCookie('auth_token');
    res.clearCookie('refresh_token');
  }
}
