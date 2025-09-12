import { Component } from '@angular/core';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-test',
  standalone: false,
  templateUrl: './test.component.html',
  styleUrl: './test.component.sass'
})
export class TestComponent {

  constructor(public testService: TestService) {
    this.testService.loadTest()
  }

}
