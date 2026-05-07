import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSecurity } from './config/security.setup';
import { setupApp } from './config/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'debug', 'error', 'warn'],
  });

  setupSecurity(app);
  setupApp(app);

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
