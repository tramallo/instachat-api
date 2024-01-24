import { WebSocketGateway, OnGatewayConnection, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    private webSocketServer!: Socket

    handleConnection(client: Socket) {
        console.log(`${client.id} connected`)
    }

    handleDisconnect(client: Socket) {
        console.log(`${client.id} disconnected`)
    }

    @SubscribeMessage('message')
    handleEvent(client: Socket, data: { sender: string, body: string }) {
        console.log(`${data.sender} said: ${data.body}`)

        this.webSocketServer.emit('message', data)
    }

}