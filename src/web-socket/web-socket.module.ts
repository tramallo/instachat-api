import { Module } from "@nestjs/common";
import { SocketGateway } from "./web-socket.gateway";

@Module({
    imports: [],
    providers: [SocketGateway],
    controllers: [],
})
export class WebSocketModule {

}