import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
})
export class TabMenuComponent implements OnInit {

  public isShareActive: boolean = false;
  @Input() isDashboard: boolean = false;
	@Input() _isMetattach: boolean = false;
	@Input() _isHomeActive: boolean = true;
	@Input() _isEnabled: boolean = false;

	@Output() homeEvent: EventEmitter<any> = new EventEmitter();
	@Output() cameraEvent: EventEmitter<any> = new EventEmitter();
	@Output() barcodeEvent: EventEmitter<any> = new EventEmitter();
	@Output() fileExplorerEvent: EventEmitter<any> = new EventEmitter();
	@Output() searchEvent: EventEmitter<any> = new EventEmitter();
	@Output() bookmarkEvent: EventEmitter<any> = new EventEmitter();
	@Output() repairListEvent: EventEmitter<any> = new EventEmitter();
	constructor() { }

	goHome() {
		this.homeEvent.emit();
	}

	ngOnInit(){
		
	}

	launchCamera() {
		this.cameraEvent.emit();
	}

	launchBarcode() {
		this.barcodeEvent.emit();
	}

	launchFileExplorer() {
		this.fileExplorerEvent.emit();
	}

	search() {
		this.searchEvent.emit();
	}

	bookmark() {
		this.bookmarkEvent.emit();
	}

	repair(){
		this.repairListEvent.emit();
	}

	share() {
		alert('This feature is not available yet!');
	}
}
