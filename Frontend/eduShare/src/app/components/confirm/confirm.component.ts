import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmService, ConfirmData } from '../../services/confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm',
  standalone: false,
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.sass']
})
export class ConfirmComponent implements OnInit, OnDestroy {
  showModal = false;
  message = '';
  private currentResolve?: (value: boolean) => void;
  private subscription?: Subscription;

  constructor(private confirmService: ConfirmService) {}

  ngOnInit() {
    this.subscription = this.confirmService.confirmState$.subscribe((data: ConfirmData) => {
      this.message = data.message;
      this.currentResolve = data.resolve;
      this.showModal = true;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onConfirm() {
    this.showModal = false;
    this.currentResolve?.(true);
  }

  onCancel() {
    this.showModal = false;
    this.currentResolve?.(false);
  }
}
