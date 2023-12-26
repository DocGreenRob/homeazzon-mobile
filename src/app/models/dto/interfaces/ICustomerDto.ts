import { IUserDto } from "./IUserDto";


export interface ICustomerDto {
    Id: number;
    Name: string;
    Email: string;
    User: IUserDto;
}
