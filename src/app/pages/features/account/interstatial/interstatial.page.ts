import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-interstatial',
	templateUrl: './interstatial.page.html',
	styleUrls: ['./interstatial.page.scss'],
})
export class InterstatialPage implements OnInit {

	constructor() {
		alert(window.location.search);
	}

	ngOnInit() {
	}

}
