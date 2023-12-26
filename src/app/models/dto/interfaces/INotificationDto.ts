import { ISuggestionDto } from "./ISuggestionDto";
import { IPrivateLabelCloneDto } from "./IPrivateLabelCloneDto";
import { IPendingAuthorizationDto } from "./IPendingAuthorizationDto";
import { IDeniedAuthorizationRequestDto } from "./IDeniedAuthorizationRequestDto";
import { IAreaNotificationDto } from "./IAreaNotificationDto";
import { IApprovedAuthorizationDto } from "./IApprovedAuthorizationDto";

export interface INotificationDto {
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
