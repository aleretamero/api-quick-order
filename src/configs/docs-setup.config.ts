import { EnvService } from '@/infra/env/env.service';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export default (app: INestApplication) => {
  const envService = app.get(EnvService);
  const appName = envService.APP_NAME;
  const apiVersion = envService.API_VERSION;
  const docsPath = envService.DOCS_PATH;

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setVersion(`v${apiVersion}`)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    `/${docsPath}`,
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  // SwaggerModule.setup(prefix, app, document);
};
