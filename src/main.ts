import { NestFactory, Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { AuthenticationGuard } from "./auth/authentication.guard";
import { ValidationPipe } from "@nestjs/common";
import { ExtendedIoAdaper } from "./web-socket/extended-io.adapter";

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);

  const globalValidationPipe = new ValidationPipe({ 
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  })

  const globalAuthenticationGuard = new AuthenticationGuard(configService, reflector)

  const corsConfig = {
    origin: configService.get<string>("CORS_ORIGIN"),
    methods: configService.get<string[]>("CORS_METHODS"),
  };

  const socketIoAdapter = new ExtendedIoAdaper(app, { 
    transports: ['websocket'], 
    cors: corsConfig
  })

  app.useGlobalPipes(globalValidationPipe)
  app.useGlobalGuards(globalAuthenticationGuard);
  app.enableCors(corsConfig);
  app.useWebSocketAdapter(socketIoAdapter)

  const port = configService.get<number>("APP_PORT");
  await app.listen(port!);
}

bootstrap();
