import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root",
})
export class AppStorageService {
  constructor(public http: HttpClient, private Storage: Storage) {
    console.log("Hello AppStorageService");
  }

  setStorage(itemName, itemValue) {
    this.Storage.set(itemName, itemValue);
  }

  getStorage(itemName) {
    return this.Storage.get(itemName).then((x) => {
      return x;
    });
  }

  removeStorage(itemName) {
    this.Storage.remove(itemName);
  }
}
