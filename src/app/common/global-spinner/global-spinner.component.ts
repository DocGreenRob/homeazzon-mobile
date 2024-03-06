import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-global-spinner',
  templateUrl: './global-spinner.component.html',
  styleUrls: ['./global-spinner.component.scss'],
})

export class GlobalSpinnerComponent  implements OnInit {
  @Input() spinnerText: string = "Searching...";
  constructor() { }

  ngOnInit() {}

}