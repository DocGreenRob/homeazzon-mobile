import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
	selector: 'app-single-design-plan',
	templateUrl: './single-design-plan.page.html',
	styleUrls: ['./single-design-plan.page.scss'],
})
export class SingleDesignPlanPage implements OnInit {
	title: string;
	pdfUrl: string;
	zoomCount: number = 1;
	@ViewChild('ion-content', { static: false }) content: ElementRef;
	@ViewChild('zoom', { static: false }) zoom: ElementRef;
	constructor(public navCtrl: NavController, private activeRoute: ActivatedRoute) {
	}
	ngOnInit() {
		console.log('ionViewDidLoad SingleDesignPlanPage');
		this.activeRoute.queryParams.subscribe(params => {
	// 		this.title = params["title"];
    //   this.pdfUrl = params["pdfUrl"];
	     this.title = "pdf demo";
	     this.pdfUrl="https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
		})
	}

	close() {
		this.navCtrl.pop();
	}

	zoomReduce() {
		this.zoomCount = this.zoomCount - 0.2;
	}

	zoomIncrease() {
		this.zoomCount = this.zoomCount + 0.2;
	}

	zoomReset() {
		this.zoomCount = 1;
	}
}
