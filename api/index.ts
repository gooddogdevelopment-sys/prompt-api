import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import express, { Request, Response } from 'express';
import { AppModule } from '../src/app.module';

const server = express();
let ready: Promise<void> | null = null;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    rawBody: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Prompt Engineer API')
    .setDescription('API for prompt engineering')
    .setVersion('1.0')
    .addTag('prompts')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token',
      },
      'clerk-jwt',
    )
    .build();

  SwaggerModule.setup('docs', app, () =>
    SwaggerModule.createDocument(app, config),
  );

  app.enableCors();
  await app.init();
}

export default async (req: Request, res: Response) => {
  if (!ready) ready = bootstrap();
  await ready;
  server(req, res);
};
