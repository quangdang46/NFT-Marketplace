// v1/test.service.ts
import { Injectable } from '@nestjs/common'; // Import Injectable để tạo service
import { ServiceClient } from '@project/shared'; // Import ServiceClient để giao tiếp với các service khác

@Injectable()
export class TestService {
  constructor(
    private readonly serviceClient: ServiceClient, // Inject ServiceClient
  ) {}

  // Hàm mẫu để tạo hoặc tìm một bản ghi trong database
 
}
