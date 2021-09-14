// eslint-disable-next-line no-shadow
export enum InventoryType {
    MARKETPLACE = 'marketplace',
    COLLECTION = 'collection',
}

export interface CommandOptions {
    username: string;
    inventoryType: InventoryType;
    discogsGenres?: string[];
}

export const DiscogsMainGenres = [
    'Blues',
    'Brass & Military',
    "Children's",
    'Classical',
    'Electronic',
    'Folk, World, & Country',
    'Funk / Soul',
    'Hip Hop',
    'Jazz',
    'Latin',
    'Non-Music',
    'Pop',
    'Reggae',
    'Rock',
    'Stage & Screen',
];
