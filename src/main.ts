import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as useragent from 'express-useragent';
import * as morgan from 'morgan';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  app.use(
    morgan('common', {
      skip: function (req, res) {
        return req.method == 'OPTIONS';
      },
    }),
  );
  app.setGlobalPrefix('api');
  app.use(useragent.express());
  app.enableCors();
  
  
  const config = new DocumentBuilder()
    .setTitle('Nursing API')
    .setDescription('The Nursing API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access_token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refresh_token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  await app.listen(3000, '0.0.0.0');
}
bootstrap();
