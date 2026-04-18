import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // `rawBody: true` preserves the untouched request body on `req.rawBody`,
  // which the Clerk webhook controller needs to verify the svix HMAC.
  const app = await NestFactory.create(AppModule, { rawBody: true });

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
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
