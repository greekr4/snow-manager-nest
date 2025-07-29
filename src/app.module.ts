import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { OptionsModule } from './options/options.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, TasksModule, UsersModule, OptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
