export interface IAddressDto {
	Id: number;
	StreetAddress1: string;
	StreetAddress2: string;
  Country: string;
  CountryCode: string;
	City: string;
  State: string;
  StateCode: string;
	Zip: string;
	country?: string;
}
