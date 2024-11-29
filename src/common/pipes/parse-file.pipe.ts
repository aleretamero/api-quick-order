import {
  HttpStatus,
  ParseFilePipeBuilder,
  PipeTransform,
} from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';

type FileSizes = `${number}${'kb' | 'mb' | 'gb'}`;

interface FilePipeOptions {
  fileType?: RegExp | string;
  maxSize?: FileSizes;
  statusCode?: ErrorHttpStatusCode;
  required?: boolean;
}

export class ParseFilePipe implements PipeTransform {
  private readonly ONE_KILOBYTE = 1024;
  private readonly ONE_MEGABYTE = 1024 * 1024;
  private readonly ONE_GIGABYTE = 1024 * 1024 * 1024;

  private readonly DEFAULT_FILE_TYPE = /jpg|jpeg|png|webp|svg/;
  private readonly DEFAULT_MAX_SIZE = this.ONE_MEGABYTE * 5;
  private readonly DEFAULT_STATUS_CODE = HttpStatus.BAD_REQUEST;
  private readonly DEFAULT_REQUIRED = false;

  public fileType: RegExp | string;
  public maxSize: number;
  public statusCode: ErrorHttpStatusCode;
  public required: boolean;

  constructor(options?: FilePipeOptions) {
    this.fileType = options?.fileType ?? this.DEFAULT_FILE_TYPE;
    this.maxSize = this.getMaxSize(options?.maxSize);
    this.statusCode = options?.statusCode ?? this.DEFAULT_STATUS_CODE;
    this.required = options?.required ?? this.DEFAULT_REQUIRED;
  }

  transform(value: unknown) {
    const validator = new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: this.fileType,
      })
      .addMaxSizeValidator({
        maxSize: this.maxSize,
      })
      .build({
        errorHttpStatusCode: this.statusCode,
        fileIsRequired: this.required,
      });

    return validator.transform(value);
  }

  private getMaxSize(offset?: FileSizes): number {
    if (!offset) {
      return this.DEFAULT_MAX_SIZE;
    }

    const match = offset.match(/(\d+)(kb|mb|gb)/);

    if (!match) {
      throw new Error(
        'Invalid offset format. Use formats like "15mb", "1gb", "75kb", etc.',
      );
    }

    const value = parseInt(match[1]);
    const unit = match[2];
    switch (unit) {
      case 'kb':
        return value * this.ONE_KILOBYTE;
      case 'mb':
        return value * this.ONE_MEGABYTE;
      case 'gb':
        return value * this.ONE_GIGABYTE;
      default:
        return this.DEFAULT_MAX_SIZE;
    }
  }
}
