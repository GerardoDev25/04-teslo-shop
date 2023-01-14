import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}
  handleConnection(client: Socket) {
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
