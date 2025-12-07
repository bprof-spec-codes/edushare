import { SearchDto } from './search-dto';

describe('SearchDto', () => {
  it('should create with default values', () => {
    const dto = new SearchDto();

    expect(dto.name).toBe('');
    expect(dto.semester).toBe(0);
    expect(dto.subjectId).toBe('');
    expect(dto.uploaderId).toBe('');
  });

  it('should create with provided values', () => {
    const dto = new SearchDto('test', 5, 'subj-1', 'user-1');

    expect(dto.name).toBe('test');
    expect(dto.semester).toBe(5);
    expect(dto.subjectId).toBe('subj-1');
    expect(dto.uploaderId).toBe('user-1');
  });

  it('should create with partial values', () => {
    const dto = new SearchDto('search term');

    expect(dto.name).toBe('search term');
    expect(dto.semester).toBe(0);
    expect(dto.subjectId).toBe('');
    expect(dto.uploaderId).toBe('');
  });
});
