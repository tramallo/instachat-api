import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { envValidationFunction } from "./util/util";
import { EnvSchema } from "./env.schema";

@Module({
  imports: [
    ConfigModule.forRoot({ validate: (envFile) => envValidationFunction(envFile, EnvSchema) }),
  ],
})
export class AppModule {}
