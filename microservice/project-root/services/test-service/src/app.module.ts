// test.module.ts
import { Module, OnModuleInit, Logger } from '@nestjs/common'; // Import các thành phần cần thiết từ NestJS
import { TestController } from './v1/test.controller'; // Import TestController
import { TestService } from './v1/test.service'; // Import TestService
import {
  getTypeOrmConfig,
  ConfigService,
  SharedConfigModule,
  ServiceDiscovery,
  getRabbitMQConfig,
  ServiceClient,
  RabbitMQHealthService,
  ClientProxy,
} from '@project/shared'; // Import các thành phần từ shared module
import { ClientsModule } from '@nestjs/microservices'; // Import ClientsModule để kết nối RabbitMQ

// Định nghĩa kiểu EventsMap và Status cho RabbitMQHealthService
type EventsMap = Record<string, (...args: any[]) => void>;
type Status = string;

// Định nghĩa tên service
const SERVICE_NAME = 'test-service';

// Định nghĩa các imports cho module
const IMPORTS = [
  SharedConfigModule, // Import SharedConfigModule để sử dụng các cấu hình chung
  ClientsModule.registerAsync([
    {
      // Đăng ký client RabbitMQ
      name: 'RABBITMQ_SERVICE',
      useFactory: (configService: ConfigService) =>
        getRabbitMQConfig(configService, SERVICE_NAME), // Lấy cấu hình RabbitMQ
      inject: [ConfigService],
    },
  ]),
];

// Định nghĩa các controllers cho module
const CONTROLLERS = [TestController];

// Định nghĩa các providers cho module
const PROVIDERS = [
  TestService, // Đăng ký TestService
  {
    provide: 'RABBITMQ_OPTIONS',
    useFactory: (configService: ConfigService) =>
      getRabbitMQConfig(configService, SERVICE_NAME), // Cung cấp cấu hình RabbitMQ
    inject: [ConfigService],
  },
  {
    provide: ServiceDiscovery,
    useFactory: async (configService: ConfigService) => {
      // Khởi tạo ServiceDiscovery để đăng ký service với Consul
      const discovery = new ServiceDiscovery(configService, SERVICE_NAME);
      const rabbitMQConfig = getRabbitMQConfig(configService, SERVICE_NAME);
      await discovery.registerService(
        SERVICE_NAME,
        { queue: rabbitMQConfig.options?.queue || `${SERVICE_NAME}-queue` },
        ['test', 'rabbitmq'], // Tags cho service
      );
      const logger = new Logger('TestModule');
      logger.log('Test Service registered with Consul');
      return discovery;
    },
    inject: [ConfigService],
  },
  {
    provide: ServiceClient,
    useFactory: (configService: ConfigService, discovery: ServiceDiscovery) => {
      // Khởi tạo ServiceClient để giao tiếp với các service khác
      return new ServiceClient(configService, discovery, [SERVICE_NAME]);
    },
    inject: [ConfigService, ServiceDiscovery],
  },
  {
    provide: RabbitMQHealthService,
    useFactory: (
      serviceDiscovery: ServiceDiscovery,
      rabbitMQClient: ClientProxy<EventsMap, Status>,
    ) => {
      // Khởi tạo RabbitMQHealthService để kiểm tra sức khỏe của RabbitMQ
      return new RabbitMQHealthService(
        SERVICE_NAME,
        rabbitMQClient,
        serviceDiscovery,
        'test-service-queue', // Queue của test-service
        ['test', 'rabbitmq'], // Tags cho health check
      );
    },
    inject: [ServiceDiscovery, 'RABBITMQ_SERVICE'],
  },
];

// Định nghĩa TestModule
@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
})
export class TestModule implements OnModuleInit {
  private readonly logger = new Logger(TestModule.name); // Tạo logger cho module

  constructor(private readonly rabbitMQHealthService: RabbitMQHealthService) {
    this.logger.log('Test Module initialized'); // Ghi log khi module được khởi tạo
  }

  // Hàm onModuleInit được gọi khi module khởi tạo
  async onModuleInit() {
    // Khởi tạo kết nối RabbitMQ
    const isClientReady = await this.rabbitMQHealthService.initializeRabbitMQ();
    if (!isClientReady) {
      this.logger.warn('Failed to initialize RabbitMQ client');
      return; // Thoát nếu không kết nối được
    }

    // Đợi 10 giây trước khi bắt đầu health check
    this.logger.log('Waiting for 10 seconds before starting health check...');
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Thực hiện health check ban đầu
    this.logger.log('Starting health check for TestModule');
    await this.rabbitMQHealthService.attemptInitialHealthCheck();

    // Bắt đầu kiểm tra sức khỏe định kỳ
    this.logger.log('Starting periodic health check...');
    this.rabbitMQHealthService.startPeriodicHealthCheck(); // Sử dụng các giá trị mặc định: maxAttempts = 15, retryDelay = 2000, interval = 15000
  }
}
