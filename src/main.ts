import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/loging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);

  // Apply the exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter());

  // Apply the validation pipe globally
  app.useGlobalPipes(new ValidationPipe({}));

  // Apply interceptors globally
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
