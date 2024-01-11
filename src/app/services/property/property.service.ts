import { Injectable } from '@angular/core';
import { baseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { IPropertyDto } from '../../models/dto/interfaces/IPropertyDto';

@Injectable({
  providedIn: 'root'
})
export class PropertyService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  async updateAddress(property: IPropertyDto) {
    return this.post(`/property/address`, property).toPromise();
  }
  // getProfileItems(profileId: number, userType: string): Observable<any> {
  //   // Implementation of the service method
  //   // Make sure you return an Observable
  //   return this.http.get<any>(`your-api-endpoint/${profileId}/${userType}`);
  // }

  /*
  * This method is used to update the property address information to make suggestions
  * 1. This will update the customer information and make association w/property
  * 2. Then it will create a RequestAuthorizations for the property to the customer
  * 3. Then it creates a proxy property
  * @param property/ IPropertyDto
  */
  async updatePropertyCustomerInformationToMakeSuggestions(property: IPropertyDto) {
    return this.post(`/property`, property).toPromise();
  }
}
