import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { FileType } from '@/common/types/file.type';
import { EnvService } from '@/infra/env/env.service';
import { Injectable } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

export type Uploadable = string;
export type Output = {
  path: string;
  url: string;
};

@Injectable()
export class StorageFirebaseService {
  private readonly client: FirebaseStorage;

  constructor(private readonly envService: EnvService) {
    const app = initializeApp({
      apiKey: this.envService.FIREBASE_API_KEY,
      authDomain: this.envService.FIREBASE_AUTH_DOMAIN,
      projectId: this.envService.FIREBASE_PROJECT_ID,
      storageBucket: this.envService.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: this.envService.FIREBASE_MESSAGING_SENDER_ID,
      appId: this.envService.FIREBASE_APP_ID,
    });

    this.client = getStorage(app);
  }

  async uploadFile(uploadable: Uploadable, file: FileType): Promise<Output> {
    const bucketName = this.extractBucket(uploadable);
    const fileName = this.getFileName();
    let mimetype = file.mimetype;

    if (this.conversableToWebP(file.originalname.split('.').pop())) {
      file.buffer = await this.convertImageToWebP(file.buffer);
      mimetype = 'image/webp';
    }

    const storageRef = ref(this.client, `${bucketName}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file.buffer, {
      contentType: mimetype,
    });
    const url = await getDownloadURL(snapshot.ref);

    return { path: fileName, url };
  }

  async uploadFiles(
    uploadable: Uploadable,
    files: FileType[],
  ): Promise<Output[]> {
    return Promise.all(
      files.map(async (file) => {
        return this.uploadFile(uploadable, file);
      }),
    );
  }

  async deleteFile(uploadable: Uploadable, filePath: string): Promise<void> {
    const bucketName = this.extractBucket(uploadable);

    const storageRef = ref(this.client, `${bucketName}/${filePath}`);
    await deleteObject(storageRef);
  }

  private extractBucket(uploadable: Uploadable): string {
    const appName = this.envService.APP_NAME;
    const uploadableName = uploadable;

    return `${appName}/${uploadableName}`.toUpperCase();
  }

  private getFileName(): string {
    const timestamp = new Date().getTime();
    const hash = randomBytes(16).toString('hex');

    return `${timestamp}_${hash}`;
  }

  private conversableToWebP(extension?: string): boolean {
    switch (extension?.replace('.', '')) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
        return true;
      case 'svg':
        return false;
      default:
        throw new Error('Invalid file extension');
    }
  }

  private async convertImageToWebP(
    file: Buffer,
    width: number = 1024,
  ): Promise<Buffer> {
    try {
      return await sharp(file, { failOn: 'error' })
        .rotate()
        .webp({ quality: 80, effort: 3 })
        .resize({ width, withoutEnlargement: true })
        .toBuffer();
    } catch (error) {
      console.error(error);
      throw new Error('Error converting image to WebP');
    }
  }
}
