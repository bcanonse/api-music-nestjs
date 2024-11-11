import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { API, CORS } from './config';
import helmet from 'helmet';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const env = configService.get<string>(
    'NODE_ENV',
    'development',
  );

  app.use(helmet());

  // Global prefix routes endpoints for example: host:port/api/users and api/tasks
  app.setGlobalPrefix(API);

  // Add cors config
  app.enableCors(CORS);

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: env === 'production',
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message:
            error.constraints[
              Object.keys(error.constraints)[0]
            ],
        }));
        return new BadRequestException(result);
      },
    }),
  );

  // Use get instance reflector for use extract metadata to requests
  const reflector = app.get(Reflector);

  //register interceptor reflector metadata
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
  );

  const config = new DocumentBuilder()
    .setTitle('API Tasks')
    .setDescription('Api Tasks with NestJS')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(
    app,
    config,
  );
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);

  console.info(
    `Application running on: ${await app.getUrl()}`,
  );
}
bootstrap();
