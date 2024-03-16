import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
})
export class NumberInputComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() value: number = 0;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;

  constructor() { }

  ngOnInit() {
    if (!this.value) {
      this.value = 0;
    }
  }

  handleInputClick() {
    if (this.value === 0) {
      this.value = null;
    }
    if (this.inputField && this.inputField.nativeElement) {
      this.inputField.nativeElement.focus();
    }
  }
  handleInputOut() {
    if (!this.value && this.value !== 0) {
      this.value = 0;
      this.valueChange.emit(this.value);
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
