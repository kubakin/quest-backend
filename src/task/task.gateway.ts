import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'typeorm';
import { Socket } from 'socket.io';

@WebSocketGateway({cors: true})
export class TaskGateway {

    @WebSocketServer()
    server

    @SubscribeMessage('join')
    handleJoin(@MessageBody() team: string, @ConnectedSocket() client: Socket) {
        client.join(team);
    }
    @SubscribeMessage('next')
    handleNext(@MessageBody() team: string, @ConnectedSocket() client) {
        this.server.to(team).emit('next', 'next');
    }
    @SubscribeMessage('chat')
    handleMessage(@MessageBody() data: {team: string, msg: string}, @ConnectedSocket() client) {
        this.server.to(data.team).to('admin').emit('chat', data)
    }
}
