import { Injectable } from '@angular/core';
import { FileContentDto } from '../dtos/file-content-dto';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  async toFileContent(file: File | Blob): Promise<FileContentDto> {
    const base64 = await this.toBase64(file)
    const fileName = (file as File).name ?? 'unknown'

    return {
      fileName,
      file: base64
    }
  }

  private toBase64(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1] ?? '')
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }
}
