import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { setupSwagger } from './swagger.config';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useLogger(new Logger());
  setupSwagger(app);

  await app.listen(process.env.PORT);
}
bootstrap();
