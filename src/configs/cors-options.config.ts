import { EnvService } from '@/infra/env/env.service';
import { INestApplication } from '@nestjs/common';

export default (app: INestApplication) =>
  app.enableCors({
    origin: (origin, callback) => {
      const envService = app.get(EnvService);

      if ((origin && envService.CORS_WHITE_LIST.includes(origin)) ?? !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
  });
