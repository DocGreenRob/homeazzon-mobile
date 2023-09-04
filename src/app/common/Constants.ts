
export class Constants {
    ToastColorGood: string = 'success';
    ToastColorBad: string = 'danger';

    Flags: Flag = new Flag();
    Provider: Provider = new Provider();
    UserTypes: UserType = new UserType();
    Subscriptions: Subscription = new Subscription();
    Actions: Actions = new Actions();
}

export class Flag {
    HasSelectedPrivateLabelerProperty: string = 'HasSelectedPrivateLabelerProperty';
    HasPrivateLabelUserCreatedProperty: string = 'HasPrivateLabelUserCreatedProperty';
    UserHasSeenMyPageTour: string = 'UserHasSeenMyPageTour';
}

export class Provider {
    Google: string = 'Google';
    Facebook: string = 'Facebook';
}

export class UserType {
    Tradesman: string = 'Tradesman';
    Owner: string = 'Owner';
    Developer: string = 'Developer';
    Appraiser: string = 'Appraiser';
    Bank: string = 'Bank';
    Architect: string = 'Architect';
    Realtor: string = 'Realtor';
    Renter: string = 'Renter';
    Vendor: string = 'Vendor';
    PrivateLabelUser: string = 'PrivateLabelUser';
    Unassigned: string = 'Unassigned';
}

export class Subscription {
    DigiDoc: string = 'DigiDoc';
}

export class ImageFileTypes {
    public static png = 'png';
    public static jpg = 'jpg';
    public static jpeg = 'jpeg';
    public static gif = 'gif';
    public static tif = 'tif';
    public static list = ['png', 'jpg', 'jpeg', 'gif', 'tif']
}

export class DocumentFileTypes {
    public static pdf = "application/pdf";
    public static word = "docx";
}

export class Actions {
    clone: string = "clone";
    move: string = "move";
    save: string = "save";
    delete: string = "delete";
}
