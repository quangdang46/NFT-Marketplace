import { Injectable } from '@nestjs/common';

import { Response } from 'express';
import {
  COOKIE_EXPIRES_IN,
  COOKIE_REFRESH_TOKEN_EXPIRES_IN,
  ServiceClient,
} from '@project/shared';

@Injectable()
export class GatewayService {
  constructor(private readonly serviceClient: ServiceClient) {}

  async sendToService<T>(service: string, pattern: any, data: any): Promise<T> {
    return this.serviceClient.sendToService(service, pattern, data);
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
