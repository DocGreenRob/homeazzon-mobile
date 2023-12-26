import { IPendingAuthorizationDto } from "./IPendingAuthorizationDto";
import { IEventDto } from "./IEventDto";


export interface IDeniedAuthorizationRequestDto {
    Count: number;
    Event: IEventDto;
    PendingAuthorization: IPendingAuthorizationDto;
}
