import { Response } from 'express';
export interface IAuthService {
  authenticateWallet(body: { message: string; signature: string }): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;

  // saveTokenToCookie(
  //   res: Response,
  //   accessToken: string,
  //   refreshToken: string,
  // ): void;

  // removeTokenFromCookie(res: Response): void;

  getNonce(): Promise<{ nonce: string }>;

  logout(address: string): Promise<void>;

  refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
}
