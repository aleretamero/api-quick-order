import { Injectable } from '@nestjs/common';
import CryptoJS from 'crypto-js';

@Injectable()
export class EncryptService {
  async encrypt(secretKey: string, text: string): Promise<string> {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  }

  async decrypt(secretKey: string, encryptedText: string): Promise<string> {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
