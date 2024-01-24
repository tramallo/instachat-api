import { INestApplicationContext, WebSocketAdapter, WsMessageHandler } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export type ExtendedIoAdapterDefaultConfig = Pick<ServerOptions, "transports" | "cors">
type SocketIoServer = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

export class ExtendedIoAdaper extends IoAdapter {

    private defaultConfig: ExtendedIoAdapterDefaultConfig

    constructor(app: INestApplicationContext, defaultConfig: ExtendedIoAdapterDefaultConfig) {
        super(app)
        this.defaultConfig = defaultConfig
    }

    create(port: number, options?: ServerOptions): SocketIoServer {
        const config = {
            ...this.defaultConfig,
            ...options!
        }
        return super.create(port, config)
    }
}