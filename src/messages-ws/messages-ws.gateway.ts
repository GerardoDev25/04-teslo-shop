import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { NewMessageDto } from './dtos/new-message.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}
  handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      client.disconnect();
      return;
    }

    console.log(payload);

    this.messagesWsService.registerClient(client);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClient(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClient(),
    );
  }

  @SubscribeMessage('message-from-client')
  hadleMessageFormClient(client: Socket, payload: NewMessageDto) {
    // * emitir al cliente
    // client.emit('messages-from-server', {
    //   fullName: 'i',
    //   message: payload.message || 'no message',
    // });
    // * emitir a todos menos al cliente
    // client.broadcast.emit('messages-from-server', {
    //   fullName: 'i',
    //   message: payload.message || 'no message',
    // });

    // * emitir a todos
    this.wss.emit('messages-from-server', {
      fullName: 'i',
      message: payload.message || 'no message',
    });
  }
}
