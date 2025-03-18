import { Response } from 'express';
export interface IAuthService {
  authenticateWallet(body: { message: string; signature: string }): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;

  getNonce(): Promise<{ nonce: string }>;

  logout(address: string): Promise<void>;

  refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
}
