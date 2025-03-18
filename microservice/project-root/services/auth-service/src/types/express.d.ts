import { JwtPayload } from '@project/shared';
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}
