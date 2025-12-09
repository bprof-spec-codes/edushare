import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.sass']
})
export class ToastComponent implements OnInit, OnDestroy {
  message: string = '';
  show = false;
  private sub?: Subscription;
  private timerSub?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.sub = this.toastService.toastState$.subscribe(message => {
      this.message = message;
      this.show = true;
      if (this.timerSub) this.timerSub.unsubscribe();
      this.timerSub = timer(5000).subscribe(() => this.show = false);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.timerSub?.unsubscribe();
  }
}
