import { Module } from '@nestjs/common';

import { TodosController } from './todo.controller';

@Module({
  controllers: [TodosController],
})
export class TodosModule {}
