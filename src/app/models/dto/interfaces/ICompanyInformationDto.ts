import { ICompanyTypeDto } from "./ICompanyTypeDto";

export interface ICompanyInformationDto {
  Id: number;
  Name: string;
  Website: string;
  Email: string;
  Phone: string;
  StreetAddress1: string;
  StreetAddress2: string;
  City: string;
  State: string;
  Zip: string;
  Type: ICompanyTypeDto;
  country: string;
}
