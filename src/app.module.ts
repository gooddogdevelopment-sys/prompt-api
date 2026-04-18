import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptModule } from './prompts/prompt.module';
import { UsersModule } from './users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';
import { ResolveUserInterceptor } from './auth/inject-user.interceptor';
import { dataSourceOptions } from './data-source';

@Module({
  imports: [
    PromptModule,
    UsersModule,
    WebhooksModule,
    TypeOrmModule.forRoot(dataSourceOptions),
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
