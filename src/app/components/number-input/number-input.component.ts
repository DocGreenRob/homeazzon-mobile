import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
})
export class NumberInputComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() value: number = 0;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if (!this.value) {
      this.value = 0;
    }
  }

  changeValue(type: string = '') {
    if (type === 'increment' && this.value < 100000) {
      this.value++;
    } else if (type === 'decrement' && this.value > 0) {
      this.value--;
    } else if (type === 'decrement') {
      this.value = 0;
    }

    this.valueChange.emit(this.value);
  }
}
