import { Module } from '@nestjs/common';
import { TodosModule } from './modules/todos/todo.module';

@Module({
  imports: [TodosModule],
})
export class AppModule {}
