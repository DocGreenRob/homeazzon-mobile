import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-shortlist',
    templateUrl: './shortlist.component.html',
    styleUrls: ['./shortlist.component.scss'],
})
export class ShortlistsPage implements OnInit {

    public currentView: string = 'list';
    public shortList: any;
    public shortLists: Array<any>;

    constructor(
        //public shortListService: ShortListService,
        public loadingController: LoadingController,
        private router: Router) { }

    async ngOnInit() {
        //await this.getShortLists();
    }

    async getShortLists() {
        const loading = await this.loadingController.create({
            message: 'Getting shortlists...'
        });
        await loading.present();

        // await this.shortListService.getShortLists()
        //     .then(
        //         (x: Array<any>) => {
        //             this.shortLists = x;
        //             loading.dismiss();
        //         },
        //         (err) => {
        //             // loading.dismiss();
        //             // if (err.message == '401') {
        //             //     this.alertService.Alert('Access Error...',
        //             //         '',
        //             //         'You need to login to continue!')
        //             //         .then(
        //             //             (x) => {
        //             //                 this.router.navigate(['home']);
        //             //             },
        //             //             (err) => { }
        //             //         );
        //             // } else {
        //             //     this.toastService.Toast('There was an error getting the shortlists!', Constants.ToastColorBad);
        //             // }
        //         }
        //     );
    }

    async selectShortList(shortListId: number) {
        const loading = await this.loadingController.create({
            message: 'Getting shortlist details...'
        });
        await loading.present();

        this.currentView = 'details';

        // await this.shortListService.getShortList(shortListId)
        //     .then(
        //         (x: any) => {
        //             this.shortList = x;
        //             loading.dismiss();
        //         },
        //         (err) => {
        //             loading.dismiss();
        //            // this.toastService.Toast('There was an error getting the shortlist details!', Constants.ToastColorBad);
        //         }
        //     );
    }

    addShortList() {
        this.shortList = {};
        this.currentView = 'details';
    }

    async saveShortList() {
        const loading = await this.loadingController.create({
            message: 'Saving shortlist...'
        });
        await loading.present();

        let isValid: boolean = true;

        if (this.shortList === undefined
            || this.shortList === null
            || this.shortList.Name === undefined
            || this.shortList.Name === null
            || this.shortList.Name.trim() === ''
            || this.shortList.Name.trim() === ' ') {
            loading.dismiss();

            // await this.alertService.Alert('Alert',
            //     '',
            //     'The Shortlist Name is required!')
            //     .then(
            //         (x) => {
            //             isValid = false;
            //         },
            //         (err) => { }
            //     );
        }
        if (isValid) {
            // this.shortListService.saveShortList(this.shortList)
            //     .then(
            //         () => {
            //             loading.dismiss();
            //            // this.toastService.Toast('The shortlist was saved successfully!', Constants.ToastColorGood);
            //             this.showListView();
            //         },
            //         (err) => {
            //             loading.dismiss();
            //             //this.toastService.Toast('There was an error saving the shortlist!', Constants.ToastColorBad);
            //             this.showListView();
            //         }
            //     );
        }
    }

    async deleteShortList(shortListId: number) {
        const loading = await this.loadingController.create({
            message: 'Deleting shortlist...'
        });
        await loading.present();

        // this.shortListService.deleteShortList(shortListId)
        //     .then(
        //         async () => {
        //             this.shortList = {};
        //             this.currentView = 'list';
        //             await this.getShortLists();
        //             loading.dismiss();
        //             //this.toastService.Toast('The shortlist was deleted successfully!', Constants.ToastColorGood);
        //         },
        //         (err) => {
        //             loading.dismiss();
        //            // this.toastService.Toast('There was an error deleting the shortlist!', Constants.ToastColorBad);
        //         }
        //     );
    }

    async showListView() {
        const loading = await this.loadingController.create({
            message: 'Getting shortlists...'
        });
        await loading.present();

        this.shortList = {};

        await this.getShortLists()
            .then(
                () => {
                    this.currentView = 'list';
                    loading.dismiss();
                },
                (err) => {
                    this.currentView = 'list';
                    loading.dismiss();
                   // this.toastService.Toast('There was an error getting the shortlists!', Constants.ToastColorBad);
                }
            );
    }
}
