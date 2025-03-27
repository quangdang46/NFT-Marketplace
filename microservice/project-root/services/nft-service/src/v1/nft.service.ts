import { Injectable } from '@nestjs/common'; // Import Injectable để tạo service
import { ServiceClient } from '@project/shared'; // Import ServiceClient để giao tiếp với các service khác

@Injectable()
export class NFTService {
  constructor(
    private readonly serviceClient: ServiceClient, // Inject ServiceClient
  ) {}

 
}
