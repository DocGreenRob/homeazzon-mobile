import { IPublicClientApplication, NavigationClient, NavigationOptions } from "@azure/msal-browser";
import { SafariViewController } from "@awesome-cordova-plugins/safari-view-controller/ngx";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser";
import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class NavigationAuthenticationClient extends NavigationClient {
  constructor(
    private platform: Platform,
    private iab: InAppBrowser
    ) {
    super();
  }

  override async navigateExternal(url: string, options: NavigationOptions): Promise<boolean> {
    if (this.platform.is('cordova')) {
      const browser = await this.iab.create(url, "_blank", {
        location: "no",
        clearcache: "yes",
        clearsessioncache: "yes",
        hidenavigationbuttons: "yes",
        hideurlbar: "yes",
        fullscreen: "yes",
      });
  
      browser.on("loadstart").subscribe((event: any) => {
        // debugger;
        if (event.url.includes("#code")) {
          browser.close();
          const domain = event.url.split("#")[0];
          const url = event.url.replace(domain, "http://localhost");
          window.location.href = "http://localhost";
        }
      });
    } else {
      if (options.noHistory) {
        window.location.replace(url);
      } else {
        window.location.assign(url);
      }
    }
    return true;
  }

  // override async navigateExternal(url: string, options: any): Promise<boolean> {

  //   // return this.safariViewController.isAvailable().then((available: boolean) => {

  //   //   if (available) {
  //   //     this.safariViewController.show({ url }).subscribe(
  //   //       (result: any) => {
  //   //         if (result.event === "opened") {
  //   //           console.log("Opened");
  //   //         }
  //   //         else if (result.event === "closed") {
  //   //           console.log("Closed");
  //   //         }

  //   //         if (result.event === "loaded") {
  //   //           console.log("Loaded");
  //   //           // this.storage.remove("profile");
  //   //           // this.storage.remove("access_token");
  //   //           // this.storage.remove("expires_at");
  //   //           this.safariViewController.hide();
  //   //         }
  //   //       });
  //   //   } else {
  //       //const browser = cordova.InAppBrowser.open(url, "_system");
  //       const browser = await this.iab.create(url, "_blank", {
  //         location: "no",
  //         clearcache: "yes",
  //         clearsessioncache: "yes",
  //         hidenavigationbuttons: "yes",
  //         hideurlbar: "yes",
  //         fullscreen: "yes",
  //       });

  //       browser.on("loadstart").subscribe((event: any) => {
  //         // debugger;
  //         if (event.url.includes("#code")) {
  //           browser.close();
  //           const domain = event.url.split("#")[0];
  //           const url = event.url.replace(domain, "http://localhost/home");

  //           // this.msalInstance
  //           //   .handleRedirectPromise(url)
  //           //   .then((res) => {
  //           //     console.log(res?.account?.name + " has authenticated");
  //           //   })
  //           //   .catch((err) => {
  //           //     console.log(err);
  //           //   });
  //         }
  //       });
  //     // }

  //   //   return available;

  //   // });
  //   return true;
  // }
            
}
