import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { EnvService } from '@/infra/env/env.service';

import globalSetupConfig from '@/configs/global-setup.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envService = app.get(EnvService);

  globalSetupConfig(app);

  await app.listen(envService.PORT);
}
bootstrap();
