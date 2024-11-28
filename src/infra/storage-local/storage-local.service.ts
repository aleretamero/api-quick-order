import * as path from 'node:path';
import * as fs from 'node:fs';
import { Injectable } from '@nestjs/common';
import { EnvService } from '@/infra/env/env.service';
import { FileType } from '@/common/types/file.type';

@Injectable()
export class StorageLocalService {
  private readonly UPLOAD_DIR = path.resolve(__dirname, '../../../uploads');

  constructor(private readonly envService: EnvService) {}

  getUrl(filename: string): string {
    return `${this.envService.BASE_URL}/uploads/${filename}`;
  }

  getFile(filename: string): FileType {
    try {
      const filePath = path.resolve(this.UPLOAD_DIR, filename);
      const buffer = fs.readFileSync(filePath);
      const splitedFilename = filename.split('.');

      if (splitedFilename.length < 2) {
        throw new Error('Invalid filename');
      }

      const extension = splitedFilename[splitedFilename.length - 1];
      const name = splitedFilename.slice(0, -1).join('.');

      return {
        fieldname: '',
        originalname: filename,
        encoding: '7bit',
        mimetype: this.getMimeType(extension),
        destination: this.UPLOAD_DIR,
        filename: name,
        path: filePath,
        size: buffer.byteLength,
        buffer,
        stream: null!,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error getting file from local storage');
    }
  }

  deleteFile(filename: string): void {
    const filePath = path.resolve(this.UPLOAD_DIR, filename);
    fs.unlinkSync(filePath);
  }

  getMimeType(extension: string): string {
    switch (extension.replace('.', '')) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'webp':
        return 'image/webp';
      case 'svg':
        return 'image/svg+xml';
      default:
        throw new Error('Invalid supported file type');
    }
  }
}
