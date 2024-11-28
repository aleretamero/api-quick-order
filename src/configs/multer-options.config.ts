import * as path from 'node:path';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import * as multer from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileType } from '@/common/types/file.type';

type Options = {
  filename?: string;
};

export const getMulterOptions = (options: Options = {}): MulterOptions => ({
  storage: multer.diskStorage({
    destination: (req: Express.Request, file: FileType, callback) => {
      const uploadsDir = path.resolve(__dirname, '../../uploads');

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      callback(null, uploadsDir);
    },

    filename: (
      req: Express.Request,
      file: FileType,
      callback: (error: Error | null, filename: string) => void,
    ) => {
      const extention = file.originalname?.split('.').pop();

      if (options.filename) {
        return callback(null, `${options.filename}.${extention}`);
      }

      const timestamp = Date.now();
      const codeString = crypto.randomBytes(16).toString('hex');
      const fileName = `${timestamp}_${codeString}.${extention}`;

      callback(null, fileName);
    },
  }),
});
