import { getMulterOptions } from '@/configs/multer-options.config';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiConsumes } from '@nestjs/swagger';

export function UseInterceptorFile(
  fieldName: string,
  localOptions: MulterOptions | null = getMulterOptions(),
) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, localOptions ? localOptions : undefined),
    ),
    ApiConsumes('multipart/form-data'),
  );
}
