import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should emit message through toastState$ observable', (done) => {
      const testMessage = 'Test toast message';

      service.toastState$.subscribe(message => {
        expect(message).toBe(testMessage);
        done();
      });

      service.show(testMessage);
    });

    it('should emit multiple messages in sequence', (done) => {
      const messages = ['First message', 'Second message', 'Third message'];
      const received: string[] = [];

      service.toastState$.subscribe(message => {
        received.push(message);
        
        if (received.length === messages.length) {
          expect(received).toEqual(messages);
          done();
        }
      });

      messages.forEach(msg => service.show(msg));
    });

    it('should emit empty string when provided', (done) => {
      service.toastState$.subscribe(message => {
        expect(message).toBe('');
        done();
      });

      service.show('');
    });

    it('should handle special characters in messages', (done) => {
      const specialMessage = 'Error: <script>alert("XSS")</script> & "quotes"';

      service.toastState$.subscribe(message => {
        expect(message).toBe(specialMessage);
        done();
      });

      service.show(specialMessage);
    });
  });

  describe('toastState$ Observable', () => {
    it('should allow multiple subscribers', (done) => {
      const testMessage = 'Broadcast message';
      let subscriber1Received = false;
      let subscriber2Received = false;

      service.toastState$.subscribe(message => {
        expect(message).toBe(testMessage);
        subscriber1Received = true;
        checkCompletion();
      });

      service.toastState$.subscribe(message => {
        expect(message).toBe(testMessage);
        subscriber2Received = true;
        checkCompletion();
      });

      function checkCompletion() {
        if (subscriber1Received && subscriber2Received) {
          done();
        }
      }

      service.show(testMessage);
    });

    it('should not emit to subscribers added after show call', (done) => {
      const testMessage = 'Already emitted';
      let lateSubscriberCalled = false;

      service.show(testMessage);

      setTimeout(() => {
        service.toastState$.subscribe(() => {
          lateSubscriberCalled = true;
        });

        setTimeout(() => {
          expect(lateSubscriberCalled).toBe(false);
          done();
        }, 50);
      }, 50);
    });
  });
});
