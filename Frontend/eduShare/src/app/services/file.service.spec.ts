import { TestBed } from '@angular/core/testing';
import { FileService } from './file.service';
import { FileContentDto } from '../dtos/file-content-dto';

describe('FileService', () => {
  let service: FileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileService]
    });
    service = TestBed.inject(FileService);
  });

  it('should convert file to base64 and extract filename', async () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

    const result: FileContentDto = await service.toFileContent(file);

    expect(result.fileName).toBe('test.txt');
    expect(result.file).toBeTruthy();
    expect(typeof result.file).toBe('string');
  });

  it('should handle blob without filename', async () => {
    const blob = new Blob(['test blob'], { type: 'text/plain' });

    const result: FileContentDto = await service.toFileContent(blob);

    expect(result.fileName).toBe('unknown');
    expect(result.file).toBeTruthy();
  });

  it('should handle empty file', async () => {
    const file = new File([], 'empty.txt', { type: 'text/plain' });

    const result: FileContentDto = await service.toFileContent(file);

    expect(result.fileName).toBe('empty.txt');
    expect(result.file).toBe('');
  });
});
