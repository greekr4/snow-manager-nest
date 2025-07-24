import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TestsModule } from './tests/tests.module';
import { TestszModule } from './testsz/testsz.module';

@Module({
  imports: [PostsModule, TestsModule, TestszModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
