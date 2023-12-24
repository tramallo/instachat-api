import { NestFactory, Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { AuthenticationGuard } from "./auth/authentication.guard";
import { ValidationPipe } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import SocketIO from 'socket.io'

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);

  /* app.useGlobalPipes(new ValidationPipe({ 
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  })) */
  /* app.useGlobalGuards(new AuthenticationGuard(configService, reflector)); */

  const corsConfig = {
    origin: configService.get<string>("CORS_ORIGIN"),
    methods: configService.get<string[]>("CORS_METHODS"),
  };
  app.enableCors(corsConfig);

  app.useWebSocketAdapter(new IoAdapter(app))
  /* const io = new SocketIO.Server(app.getHttpServer(), {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  }); */
  //app.useWebSocketAdapter(io);



  const port = configService.get<number>("APP_PORT");
  await app.listen(port!);
}

bootstrap();
