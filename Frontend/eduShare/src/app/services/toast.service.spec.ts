import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should emit message through toastState$ observable', (done) => {
    const testMessage = 'Test toast message';

    service.toastState$.subscribe(message => {
      expect(message).toBe(testMessage);
      done();
    });

    service.show(testMessage);
  });

  it('should emit multiple messages in sequence', (done) => {
    const messages = ['First message', 'Second message'];
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
});
