import { ILineitemDto } from "src/app/models/dto/interfaces/ILineItemDto";
import { UserLineitemsDto } from "./../../models/dto/interfaces/UserLineItemsDto";
import { Injectable } from "@angular/core";
import { baseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IUserLineitemDto } from "src/app/models/dto/interfaces/IUserLineitemDto";

@Injectable({
  providedIn: "root",
})
export class LineitemService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  async getLineitems() {
    return this.get(`/lineItem`).toPromise();
  }

  async saveUserDefinedLineItems(userLineitemDto: UserLineitemsDto) {
    return this.post(`/lineItem/user-defined`, userLineitemDto).toPromise();
  }

  async saveUserLineitem(userLineitemDto: IUserLineitemDto) {
    return this.post(`/lineItem/user`, userLineitemDto).toPromise();
  }

  async deleteUserDefinedLineitem(id: number) {
    return this.delete(`/lineItem/user-defined/${id}`).toPromise();
  }

  async updateUserDefinedLineitem(item: ILineitemDto) {
    return this.put(`/lineItem/user-defined`, item).toPromise();
  }
}
