import { Injectable } from '@angular/core';
import { FileContent } from '../models/file-content';
import { read } from '@popperjs/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  async toFileContent(file: File): Promise<FileContent>{
    const base64 = await this.toBase64(file)
    return{
      fileName: file.name,
      base64: base64
    }
  }

  private toBase64(file: File): Promise<string>{
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result as string).split(',')[1] || '')
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }
}
