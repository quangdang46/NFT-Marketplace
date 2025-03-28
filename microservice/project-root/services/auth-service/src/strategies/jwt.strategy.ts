import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getJwtConfig } from '@project/shared';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtConfig().secret,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, address: payload.address, role: payload.role };
  }
}
