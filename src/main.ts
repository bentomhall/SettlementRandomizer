import { ApplicationConfig, HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { CatchEverythingFilter } from './catch-all.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CatchEverythingFilter(app.get(HttpAdapterHost)), new HttpExceptionFilter())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
