import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { Observable, Observer, Subject } from "rxjs";
import { share } from "rxjs/operators";
import { IPropertyDto } from "src/app/models/dto/interfaces/IPropertyDto";
@Injectable({
  providedIn: "root",
})
export class CommunicatorService extends baseService {
  public subjectProperties = new Subject<void>();
  private subjectProperty = new Subject<void | IPropertyDto>();
  constructor(public override http: HttpClient) {
    super(http);
  }

  sendProperties(properties: any) {
    window.dispatchEvent(new CustomEvent("properties:loaded", { detail: properties }));
  }

  clearMessage() {
    this.subjectProperties.next();
  }

  getProperties(): Observable<any> {
    return this.subjectProperties.asObservable();
  }

  sendSelectedProperty(property: IPropertyDto) {
    this.subjectProperty.next(property);
  }

  getSelectedProperty(): Observable<any> {
    return this.subjectProperty.asObservable();
  }
}
