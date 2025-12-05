import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ConfirmData {
  message: string;
  resolve: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private confirmSubject = new Subject<ConfirmData>();
  public confirmState$ = this.confirmSubject.asObservable();

  confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmSubject.next({ message, resolve });
    });
  }
}
