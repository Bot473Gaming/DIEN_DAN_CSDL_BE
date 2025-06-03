import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/loging.interceptor';
// import { RolesGuard } from './common/guards/roles.guard';
// import { AuthGuard } from './common/guards/auth.guard';
// import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);

  // Apply the exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: '*', // Chỉ cho phép từ domain này
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được cho phép
    credentials: true, // Cho phép gửi cookie/token qua CORS
  });
  // Apply the validation pipe globally
  app.useGlobalPipes(new ValidationPipe({}));

  // Apply interceptors globally
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
  );

  // // Apply guards globally
  // const reflector = new Reflector();
  // app.useGlobalGuards(
  //   new AuthGuard(app.get(JwtService)),
  // new RolesGuard(reflector),
  // );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
