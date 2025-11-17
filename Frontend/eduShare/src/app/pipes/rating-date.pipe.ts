import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingDate',
  standalone: false
})
export class RatingDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) { }

  transform(value: Date | string | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const isUnder24h = diffMs < 24 * 60 * 60 * 1000;

    if (isUnder24h) {
      return this.datePipe.transform(date, 'HH:mm') ?? '';
    }

    return this.datePipe.transform(date, 'yyyy.MM.dd.') ?? '';
  }
}
