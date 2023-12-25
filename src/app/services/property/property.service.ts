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

}
