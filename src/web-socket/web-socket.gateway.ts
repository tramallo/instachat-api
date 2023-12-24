import { WebSocketGateway, OnGatewayConnection, WebSocketServer, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { inspect } from 'util'

@WebSocketGateway(undefined, {
    cors: { origin: 'http://localhost:5173' },
    transports: ['websocket']
})
export class SocketGateway implements OnGatewayConnection {

    @WebSocketServer()
    private webSocketServer!: Socket

    handleConnection(client: Socket) {
        console.log(`Client connected: ${inspect(client.id)}`)

        return `${client.id}: connected!`
    }

    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: string) {
        console.log(`Message received`)
        console.log(data)
    }

}