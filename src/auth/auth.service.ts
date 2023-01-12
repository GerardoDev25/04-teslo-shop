import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(data: CreateUserDto) {
    try {
      data.password = bcrypt.hashSync(data.password, 10);
      const user = this.userRepository.create(data);

      await this.userRepository.save(user);
      delete user.password;

      return { ...user, token: this.getJwToken({ id: user.id }) };
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async login(data: LoginUserDto) {
    const { email, password } = data;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user) {
      throw new UnauthorizedException('credentials are not valid');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('credentials are not valid');
    }

    return { ...user, token: this.getJwToken({ id: user.id }) };
  }

  async checkAuthStatus(user: User) {
    return { ...user, token: this.getJwToken({ id: user.id }) };
  }

  private handleDbException(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'unexpected error, check server logs',
    );
  }

  private getJwToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
