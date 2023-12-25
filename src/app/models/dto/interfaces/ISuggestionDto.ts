import { IApprovedAuthorizationDto } from "./IApprovedAuthorizationDto";
import { IAreaNotificationDto } from "./IAreaNotificationDto";
import { IDeniedAuthorizationRequestDto } from "./IDeniedAuthorizationRequestDto";
import { IPendingAuthorizationDto } from "./IPendingAuthorizationDto";
import { IPrivateLabelCloneDto } from "./IPrivateLabelCloneDto";


export interface ISuggestionDto {
    ApprovedAuthorization: IApprovedAuthorizationDto;
    AreaNotification: IAreaNotificationDto;
    Date: string;
    DeniedAuthorizationRequest: IDeniedAuthorizationRequestDto;
    Message: string;
    PendingAuthorization: IPendingAuthorizationDto;
    PrivateLabelClone: IPrivateLabelCloneDto;
    Sender: string;
    Suggestion: ISuggestionDto;
    Type: string;
}
