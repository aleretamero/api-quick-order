import * as path from 'node:path';
import * as fs from 'node:fs';
import { Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  I18nModule as DefaultI18nModule,
} from 'nestjs-i18n';
import { I18nService } from '@/infra/i18n/i18n-service';

@Module({
  imports: [
    DefaultI18nModule.forRootAsync({
      useFactory: async () => {
        async function convertImportDefaultFilesToJSON(
          directory: string,
          regex: RegExp = /^(?!.*\.d\.ts$).*\.(ts|js)$/,
        ): Promise<void> {
          const files = await fs.promises.readdir(directory);

          for (const file of files) {
            const filePath = path.join(directory, file);
            const fileStat = await fs.promises.stat(filePath);

            if (fileStat.isDirectory()) {
              await convertImportDefaultFilesToJSON(filePath, regex);
            } else if (filePath.match(regex)) {
              const data = (await import(filePath))?.default;
              if (!data) continue;

              const jsonFileName = filePath.replace(/\.(ts|js)$/, '.json');
              fs.writeFileSync(jsonFileName, JSON.stringify(data, null, 2));
            }
          }
        }

        await convertImportDefaultFilesToJSON(path.join(__dirname, 'locales'));

        return {
          fallbackLanguage: 'pt',
          loaderOptions: {
            path: path.join(__dirname, 'locales'),
            watch: true,
          },
        };
      },
      resolvers: [AcceptLanguageResolver],
    }),
  ],
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {}
