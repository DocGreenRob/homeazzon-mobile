import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { baseService } from "../base.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class BarcodeService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }
  getBarCodeData(barcodeText) {
    return this.get("/upc/" + barcodeText);
  }

  // save Upc
  async postBarcodeProduct(postObject) {
    return this.post("/product", postObject).toPromise();
  }

  // save QRCode
  async postQrCode(postObject) {
    return this.post("/qrcode", postObject).toPromise();
  }
}
