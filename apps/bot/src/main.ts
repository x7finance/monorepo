import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.NESTJS_PORT || 3008);
  } catch (error) {
    console.log(error);
  }
}

try {
  bootstrap();
} catch (error) {
  console.log(error);
}
