import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user as User;

    if (!user) {
      throw new InternalServerErrorException('user not found (request)');
    }

    return user;
  },
);
