import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClient {
  [id: string]: { socket: Socket; user: User };
}

@Injectable()
export class MessagesWsService {
  private connectedClient: ConnectedClient = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error('user not found');
    if (!user.isActive) throw new Error('user not active');

    this.connectedClient[client.id] = { socket: client, user };
  }

  removeClient(clientId: string) {
    delete this.connectedClient[clientId];
  }

  getConnectedClient(): string[] {
    return Object.keys(this.connectedClient);
  }

  getUserFullNameBySocketId(socketId: string): string {
    return this.connectedClient[socketId].user.fullName;
  }
}
