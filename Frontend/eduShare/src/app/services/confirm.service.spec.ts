import { TestBed } from '@angular/core/testing';
import { ConfirmService } from './confirm.service';

describe('ConfirmService', () => {
  let service: ConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmService]
    });
    service = TestBed.inject(ConfirmService);
  });

  it('should emit confirm data with message and resolve function', (done) => {
    const testMessage = 'Are you sure?';

    service.confirmState$.subscribe(data => {
      expect(data.message).toBe(testMessage);
      expect(typeof data.resolve).toBe('function');
      done();
    });

    service.confirm(testMessage);
  });

  it('should resolve promise with true when resolve function is called with true', async () => {
    let capturedResolve: ((value: boolean) => void) | undefined;

    service.confirmState$.subscribe(data => {
      capturedResolve = data.resolve;
    });

    const promise = service.confirm('Delete this item?');
    capturedResolve?.(true);

    expect(await promise).toBe(true);
  });

  it('should resolve promise with false when resolve function is called with false', async () => {
    let capturedResolve: ((value: boolean) => void) | undefined;

    service.confirmState$.subscribe(data => {
      capturedResolve = data.resolve;
    });

    const promise = service.confirm('Cancel?');
    capturedResolve?.(false);

    expect(await promise).toBe(false);
  });
});
