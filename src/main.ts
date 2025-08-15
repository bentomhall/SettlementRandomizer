import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { CatchEverythingFilter } from './catch-all.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new CatchEverythingFilter(app.get(HttpAdapterHost)), new HttpExceptionFilter())
  app.useBodyParser('json', {limit: '50mb'});
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, 'views'));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
