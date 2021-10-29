import { Module } from '@nestjs/common';

import { AuthorizedController } from './authorized.controller';

@Module({
  controllers: [AuthorizedController],
})
export class AuthorizedModule {}
