import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data, context: ExecutionContext) => {
    const headers = context.switchToHttp().getRequest();

    return headers.rawHeaders;
  },
);
