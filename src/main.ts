import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);

  // Apply the exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter());

  // Apply the validation pipe globally
  app.useGlobalPipes(new ValidationPipe({}));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
