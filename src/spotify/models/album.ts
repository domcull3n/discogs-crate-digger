export interface GetAlbumResponse {
    tracks: {
        items: Track[];
    };
}

interface Track {
    name: string;
    id: string;
    uri: string;
}
