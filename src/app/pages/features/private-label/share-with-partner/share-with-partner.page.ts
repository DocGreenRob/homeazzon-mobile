import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-share-with-partner',
	templateUrl: './share-with-partner.page.html',
	styleUrls: ['./share-with-partner.page.scss'],
})
export class ShareWithPartnerPage implements OnInit {

	constructor(private router: Router) { }

	ngOnInit() {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ShareWithPartnerPage');
	}

	//get navigate the private-label profile page 
	SelectNo() {
		this.router.navigate(['intro']);
	}

	//get navigate the sharemail-partner page 
	SelectYes() {
		this.router.navigate(['share-mail-partner']);
	}

}
