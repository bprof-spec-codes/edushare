import { TestBed } from '@angular/core/testing';
import { ConfirmService } from './confirm.service';

describe('ConfirmService Logic Tests', () => {
  let service: ConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmService]
    });
    service = TestBed.inject(ConfirmService);
  });

  describe('Confirm Logic', () => {
    it('should emit confirm data with message', (done) => {
      const testMessage = 'Are you sure?';

      service.confirmState$.subscribe(data => {
        expect(data.message).toBe(testMessage);
        expect(data.resolve).toBeDefined();
        expect(typeof data.resolve).toBe('function');
        done();
      });

      service.confirm(testMessage);
    });

    it('should resolve promise when resolve function is called with true', async () => {
      const testMessage = 'Delete this item?';
      let capturedResolve: ((value: boolean) => void) | undefined;

      service.confirmState$.subscribe(data => {
        capturedResolve = data.resolve;
      });

      const promise = service.confirm(testMessage);
      
      // Simulate user confirming
      capturedResolve?.(true);

      const result = await promise;
      expect(result).toBe(true);
    });

    it('should resolve promise when resolve function is called with false', async () => {
      const testMessage = 'Cancel operation?';
      let capturedResolve: ((value: boolean) => void) | undefined;

      service.confirmState$.subscribe(data => {
        capturedResolve = data.resolve;
      });

      const promise = service.confirm(testMessage);
      
      // Simulate user canceling
      capturedResolve?.(false);

      const result = await promise;
      expect(result).toBe(false);
    });

    it('should return a promise', () => {
      const result = service.confirm('Test message');
      expect(result).toBeInstanceOf(Promise);
    });

    it('should emit on every confirm call', () => {
      let emitCount = 0;

      service.confirmState$.subscribe(() => {
        emitCount++;
      });

      service.confirm('First message');
      service.confirm('Second message');
      service.confirm('Third message');

      expect(emitCount).toBe(3);
    });

    it('should handle multiple subscribers', (done) => {
      const testMessage = 'Multiple subscribers test';
      let subscriber1Called = false;
      let subscriber2Called = false;

      service.confirmState$.subscribe(data => {
        subscriber1Called = true;
        expect(data.message).toBe(testMessage);
      });

      service.confirmState$.subscribe(data => {
        subscriber2Called = true;
        expect(data.message).toBe(testMessage);
        
        if (subscriber1Called && subscriber2Called) {
          done();
        }
      });

      service.confirm(testMessage);
    });
  });
});
