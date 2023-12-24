import { Module } from "@nestjs/common";
import { SocketGateway } from "./web-socket.gateway";
import { TestController } from "./test.controller";

@Module({
    imports: [],
    providers: [SocketGateway],
    controllers: [TestController],
})
export class WebSocketModule {

}