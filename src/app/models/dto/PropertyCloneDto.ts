

export class ClonePropertyDto {
    PropertyId: number;
    IsProxy: boolean;
    ProfileItems: Array<CloneProfileItemDto>;

}

export class CloneProfileItemDto {
    ProfileItemId: number;
    LineItems: Array<CloneLineItemDto>;
}

export class CloneLineItemDto {
    LineItemId: number;
}