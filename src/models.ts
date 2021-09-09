// eslint-disable-next-line no-shadow
export enum InventoryType {
    MARKETPLACE = 'marketplace',
    COLLECTION = 'collection',
}

export interface CommandOptions {
    username: string;
    inventoryType: InventoryType;
}
