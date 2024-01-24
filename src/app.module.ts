import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envValidationFunction } from "./util/util";
import { EnvSchema } from "./env.schema";
import { WebSocketModule } from "./web-socket/web-socket.module";
import { TestController } from "./test.controller";

@Module({
  imports: [
    WebSocketModule,
    ConfigModule.forRoot({ validate: (envFile) => envValidationFunction(envFile, EnvSchema) }),
  ],
  controllers: [ TestController ]
})
export class AppModule {}
