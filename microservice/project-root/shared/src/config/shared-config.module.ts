import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Đảm bảo tất cả các module đều có thể dùng ConfigService
      envFilePath: ".env",
    }),
  ],
  exports: [ConfigModule],
})
export class SharedConfigModule {}
export { ConfigService };
