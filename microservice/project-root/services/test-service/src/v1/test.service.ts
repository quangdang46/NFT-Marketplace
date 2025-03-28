import { Injectable } from '@nestjs/common';
import { ServiceClient } from '@project/shared';

@Injectable()
export class TestService {
  constructor(private readonly serviceClient: ServiceClient) {}
}
