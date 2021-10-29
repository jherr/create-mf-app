import { Module } from '@nestjs/common';

import { UnauthorizedController } from './unauthorized.controller';

@Module({
  controllers: [UnauthorizedController],
})
export class UnauthorizedModule {}
