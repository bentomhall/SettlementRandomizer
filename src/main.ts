import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { CatchEverythingFilter } from './catch-all.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new CatchEverythingFilter(app.get(HttpAdapterHost)), new HttpExceptionFilter())
  app.useBodyParser('json', {limit: '5mb'});
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
