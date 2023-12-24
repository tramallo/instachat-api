import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { envValidationFunction } from "./util/util";
import { EnvSchema } from "./env.schema";
import { WebSocketModule } from "./web-socket/web-socket.module";

@Module({
  imports: [
    WebSocketModule,
    ConfigModule.forRoot({ validate: (envFile) => envValidationFunction(envFile, EnvSchema) }),
  ],
})
export class AppModule {}
