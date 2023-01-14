import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClient {
  [id: string]: Socket;
}

@Injectable()
export class MessagesWsService {
  private connectedClient: ConnectedClient = {};

  registerClient(client: Socket) {
    this.connectedClient[client.id] = client;
  }

  removeClient(clientId: string) {
    delete this.connectedClient[clientId];
  }

  getConnectedClient(): string[] {
    return Object.keys(this.connectedClient);
  }
}
