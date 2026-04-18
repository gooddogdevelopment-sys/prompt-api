import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prompt } from './prompts/entities/prompt.entity';
import { User } from './prompts/entities/user.entity';
import { PromptModule } from './prompts/prompt.module';
import { UsersModule } from './users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';
import { ResolveUserInterceptor } from './auth/inject-user.interceptor';

@Module({
  imports: [
    PromptModule,
    UsersModule,
    WebhooksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'prompt_api',
      entities: [Prompt, User],
      synchronize: true, // remove later for migrations
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResolveUserInterceptor,
    },
  ],
})
export class AppModule {}
