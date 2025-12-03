import { TestBed } from '@angular/core/testing';
import { FileService } from './file.service';
import { FileContentDto } from '../dtos/file-content-dto';

describe('FileService Logic Tests', () => {
  let service: FileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileService]
    });
    service = TestBed.inject(FileService);
  });

  describe('File to Base64 Conversion Logic', () => {
    it('should convert file to base64 and extract filename', async () => {
      const mockFileContent = 'test file content';
      const blob = new Blob([mockFileContent], { type: 'text/plain' });
      const file = new File([blob], 'test.txt', { type: 'text/plain' });

      const result: FileContentDto = await service.toFileContent(file);

      expect(result.fileName).toBe('test.txt');
      expect(result.file).toBeTruthy();
      expect(typeof result.file).toBe('string');
    });

    it('should handle blob without filename', async () => {
      const mockFileContent = 'test blob content';
      const blob = new Blob([mockFileContent], { type: 'text/plain' });

      const result: FileContentDto = await service.toFileContent(blob);

      expect(result.fileName).toBe('unknown');
      expect(result.file).toBeTruthy();
    });

    it('should extract base64 content without data URL prefix', async () => {
      const mockFileContent = 'test';
      const file = new File([mockFileContent], 'test.txt', { type: 'text/plain' });

      const result: FileContentDto = await service.toFileContent(file);

      // Base64 string should not contain "data:text/plain;base64," prefix
      expect(result.file).not.toContain('data:');
      expect(result.file).not.toContain('base64,');
    });

    it('should handle empty file', async () => {
      const file = new File([], 'empty.txt', { type: 'text/plain' });

      const result: FileContentDto = await service.toFileContent(file);

      expect(result.fileName).toBe('empty.txt');
      expect(result.file).toBe('');
    });

    it('should handle different file types', async () => {
      const jsonContent = '{"test": "data"}';
      const file = new File([jsonContent], 'data.json', { type: 'application/json' });

      const result: FileContentDto = await service.toFileContent(file);

      expect(result.fileName).toBe('data.json');
      expect(result.file).toBeTruthy();
      expect(typeof result.file).toBe('string');
    });

    it('should handle files with special characters in name', async () => {
      const content = 'test';
      const file = new File([content], 'test file (1).txt', { type: 'text/plain' });

      const result: FileContentDto = await service.toFileContent(file);

      expect(result.fileName).toBe('test file (1).txt');
      expect(result.file).toBeTruthy();
    });

    it('should return promise that resolves', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });

      const promise = service.toFileContent(file);

      expect(promise).toBeInstanceOf(Promise);
      await expectAsync(promise).toBeResolved();
    });

    it('should handle binary content', async () => {
      const binaryData = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
      const file = new File([binaryData], 'binary.bin', { type: 'application/octet-stream' });

      const result: FileContentDto = await service.toFileContent(file);

      expect(result.fileName).toBe('binary.bin');
      expect(result.file).toBeTruthy();
      expect(typeof result.file).toBe('string');
    });
  });

  describe('Base64 Encoding Logic', () => {
    it('should produce valid base64 string', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

      const result: FileContentDto = await service.toFileContent(file);

      // Valid base64 contains only A-Z, a-z, 0-9, +, /, and =
      const base64Regex = /^[A-Za-z0-9+/=]*$/;
      expect(base64Regex.test(result.file)).toBe(true);
    });

    it('should produce consistent base64 for same content', async () => {
      const content = 'consistent test';
      const file1 = new File([content], 'file1.txt', { type: 'text/plain' });
      const file2 = new File([content], 'file2.txt', { type: 'text/plain' });

      const result1 = await service.toFileContent(file1);
      const result2 = await service.toFileContent(file2);

      expect(result1.file).toBe(result2.file);
    });

    it('should produce different base64 for different content', async () => {
      const file1 = new File(['content1'], 'file1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'file2.txt', { type: 'text/plain' });

      const result1 = await service.toFileContent(file1);
      const result2 = await service.toFileContent(file2);

      expect(result1.file).not.toBe(result2.file);
    });
  });
});
