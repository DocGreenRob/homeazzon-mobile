import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, ModalController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
import { SocialSharing } from "@awesome-cordova-plugins/social-sharing/ngx";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { Constants } from "src/app/common/Constants";
@Component({
  selector: "app-interactive-model-modal",
  templateUrl: "./interactive-model-modal.page.html",
  styleUrls: ["./interactive-model-modal.page.scss"],
})
export class InteractiveModelModalPage implements OnInit {
  links: any = [];
  Constants: Constants = new Constants();
  selectedLink: any = {
    Name: "",
    Url: "",
  };
  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    private socialSharing: SocialSharing,
    private toastService: UxNotifierService
  ) {}

  ngOnInit() {
    console.log("ionViewDidLoad LinksModalPage");
    this.getLinks();
  }

  getLinks() {
    this.links = this.navParams.get("links");
    this.selectedLink = this.links[0];
  }
  sanitizeUrl(url: string) {
    //console.log(url)
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  viewLink(link) {
    this.selectedLink = link;
  }

  next() {
    let index = this.links.indexOf(this.selectedLink);
    let maxIndex = this.links.length - 1;
    if (index < maxIndex) {
      this.selectedLink = this.links[index + 1];
    } else {
      this.selectedLink = this.links[0];
    }
  }

  previous() {
    let index = this.links.indexOf(this.selectedLink);
    let minIndexh = 0;

    if (index > minIndexh) {
      this.selectedLink = this.links[index - 1];
    } else {
      this.selectedLink = this.links[0];
    }
  }

  share() {
    this.socialSharing.share(this.selectedLink.Name, this.selectedLink.Name, null, this.selectedLink.Url).then(
      (response) => {
        this.toastService.showToast("Link was shared successfully", this.Constants.ToastColorGood);
      },
      (error) => {
        this.toastService.showToast("Sharing was cancelled", this.Constants.ToastColorBad);
      }
    );
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
