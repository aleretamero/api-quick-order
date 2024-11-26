import { INestApplication, ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { GlobalExceptionFilter } from '@/common/excption-filters/global-exception.filter';

export default (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );
};
