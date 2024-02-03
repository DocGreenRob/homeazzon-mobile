import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { ModalController, NavParams, Platform } from "@ionic/angular";
import { Constants } from "../../../common/Constants";
import { ArtifactIndexContactInformationDto } from "../../../models/dto/interfaces/ArtifactIndexContactInformationDto";
import { IContactInformationDto } from "../../../models/dto/interfaces/IContactInformationDto";
import { ArtifactIndexService } from "../../../services/artifact-index/artifact-index.service";
import { ContactInformationService } from "../../../services/contact-information/contact-information.service";
import { UtilitiesService } from "../../../services/utlities/utilities.service";
import { UxNotifierService } from "../../../services/uxNotifier/ux-notifier.service";
import { BasePage } from "../../base/base.page";
import { EmailDto } from "src/app/models/dto/EmailDto";
import { LocalStorageService } from "@app/services/local-storage.service";

@Component({
  selector: "app-contact-information-modal",
  templateUrl: "./contact-information-modal.page.html",
  styleUrls: ["./contact-information-modal.page.scss"],
})
export class ContactInformationModalPage extends BasePage implements OnInit {
  private constants: Constants = new Constants();

  public doesContactExist: boolean = false;
  public view: string = "read-only";
  public contactInformation: IContactInformationDto = {} as IContactInformationDto;
  public contacts: Array<any>;

  public hasPhone: boolean = false;
  public hasEmail: boolean = false;

  public contactInformationId: number;

  public sendEmailForm = new FormGroup({
    To: new FormControl("", [Validators.required]),
    From: new FormControl("", [Validators.required]),
    Subject: new FormControl("", [Validators.required]),
    Message: new FormControl("", [Validators.required]),
  });

  constructor(
    private modalController: ModalController,
    public override navParams: NavParams,
    private alertService: UxNotifierService,
    public override platform: Platform,
    private iab: InAppBrowser,
    private utilityService: UtilitiesService,
    private contactInformationService: ContactInformationService,
    private artifactIndexService: ArtifactIndexService,
    public override storageService: LocalStorageService
  ) {
    super(null, navParams, null, null, platform, null, null, null, null, null, storageService);
  }

  override ngOnInit() {
    const parsedInfo = this.navParams.get("x");
    this.contactInformation = parsedInfo;

    if (!this.contactInformation) {
      this.doesContactExist = false;
      this.contactInformation = { Name: "", Email: "", Phone: "", Notes: "", Website: "" } as IContactInformationDto;
    } else {
      this.doesContactExist = true;
      this.contactInformationId = this.contactInformation.Id;
      this.determineIfHasPhoneAndOrEmail();
    }

    this.getAllContacts();
  }

  cancel() {
    this.modalController.dismiss();
  }

  showEditView() {
    this.view = "add-edit";
    this.doesContactExist = true;
  }

  // TODO: I modified the logic thinking it was broke, also there were some missing stored procs in API Manager
  // So I refactored, but maybe add back (either way this may suffice until re-write into microservices)
  saveContactInformation() {
    if (this.contactInformation) {
      let activeItem = this.ActiveItem;
      //this.contactInformation.ArtifactIndexId = activeItem.ArtifactIndexId;
      //this.contactInformation.ArtifactType = activeItem.Type;
      this.contactInformationService.upsertContactInformationAsync(this.contactInformation).then((x: number) => {
        var artifactIndexContactInformationDto: ArtifactIndexContactInformationDto = new ArtifactIndexContactInformationDto();

        artifactIndexContactInformationDto.ArtifactIndexId = activeItem.ArtifactIndexId;
        artifactIndexContactInformationDto.ArtifactType = activeItem.Type;
        artifactIndexContactInformationDto.ContactInformationId = x;

        this.artifactIndexService.insertContactInformation(artifactIndexContactInformationDto).then((y) => {
          this.alertService.showToast("Contact Information Updated", this.constants.ToastColorGood);

          if (this.modalController != undefined && this.modalController != null) {
            this.modalController.dismiss(this.contactInformation);
          }
        }).catch((e) => {
          this.alertService.showToast(`Error: ${e.Message}`, this.constants.ToastColorBad);
        });
      }).catch((e) => {
        this.alertService.showToast(`Error: ${e.Message}`, this.constants.ToastColorBad);
      });
    } else {
      this.alertService.showToast("Please fill all the fields to continue", this.constants.ToastColorBad);
    }
  }

  onContactInformationChanged() {
    const contact = this.contacts.filter((x) => x.Id == this.contactInformationId);
    if (contact.length > 0) {
      this.contactInformation = contact[0];
      this.determineIfHasPhoneAndOrEmail();
    }
  }

  showContactForm() {
    this.doesContactExist = true;
    this.view = "add-edit";
  }

  private determineIfHasPhoneAndOrEmail() {
    if (this.contactInformation.Phone != undefined && this.contactInformation.Phone != null && this.contactInformation.Phone.length > 0) {
      this.hasPhone = true;
    }
    if (this.contactInformation.Email != undefined && this.contactInformation.Email != null && this.contactInformation.Email.length > 0) {
      this.hasEmail = true;
    }
  }

  text() {
    if (this.contactInformation.Phone != undefined && this.contactInformation.Phone != null) {
      this.iab.create(`sms:${this.contactInformation.Phone}`, "_system");
    } else {
      this.alertService.showToast("Couldn't find a phone number to sms", this.constants.ToastColorBad);
    }
  }

  call() {
    if (this.contactInformation.Phone != undefined && this.contactInformation.Phone != null) {
      this.iab.create(`tel:${this.contactInformation.Phone}`, "_system");
    } else {
      this.alertService.showToast("Couldn't find a phone number to call", this.constants.ToastColorBad);
    }
  }

  email() {
    this.view = "send-email";
    this.sendEmailForm.patchValue({
      To: this.contactInformation.Email,
      From: this.User.Email,
      Subject: `${this.ActiveItem.Name}`,
    });
  }

  sendEmail() {
    if (this.sendEmailForm.invalid) {
      this.alertService.showToast("Please fill all the required fields to continue", this.constants.ToastColorBad);
    } else {
      // debugger;
      const email = this.sendEmailForm.value as EmailDto;
      this.utilityService.sendEmail(email).then(
        (x) => {
          console.log(x);
          this.sendEmailForm.reset();
          this.view = "read-only";
          this.alertService.showToast("Email was sent successfully", this.constants.ToastColorGood);
        },
        (error) => {
          this.alertService.showToast("Error sending email, please try again later.", this.constants.ToastColorBad);
        }
      );
    }
  }

  get To() {
    return this.sendEmailForm.get("To");
  }

  get From() {
    return this.sendEmailForm.get("From");
  }

  get Subject() {
    return this.sendEmailForm.get("Subject");
  }

  get Message() {
    return this.sendEmailForm.get("Message");
  }

  getAllContacts() {
    this.contactInformationService
      .getAllAsync()
      .then((x) => {
        this.contacts = x;
      })
      .catch((e) => { });
  }
}
