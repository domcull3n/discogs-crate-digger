export interface AddItemsToPlaylistRequest {
    uris: string[];
}

export interface AddItemsToPlaylistResponse {
    snapshot_id: string;
}

export interface CreatePlaylistRequest {
    name: string;
    public: boolean;
    collaborative: boolean;
    description: string;
}

export interface CreatePlaylistResponse {
    id: string;
    href: string;
    name: string;
    type: string;
    uri: string;
}
