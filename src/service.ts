import DiscogsClient from './discogs/client';
import { InventoryItem } from './discogs/models/generic';
import { InventoryType } from './models';
import SpotifyClient from './spotify/client';
import { CreatePlaylistResponse } from './spotify/models/playlists';

export default class Service {
    private discogsClient: DiscogsClient;
    private spotifyClient: SpotifyClient;

    constructor(spotifyToken: string) {
        this.discogsClient = new DiscogsClient();
        this.spotifyClient = new SpotifyClient(spotifyToken);
    }

    async run(discogsUsername: string, inventoryType: InventoryType): Promise<void> {
        const playlist = await this.createPlaylist(discogsUsername, inventoryType);
        await this.iterateInventory(discogsUsername, playlist, inventoryType, 1);
    }

    async createPlaylist(discogsUsername: string, inventoryType: InventoryType): Promise<CreatePlaylistResponse> {
        const user = await this.spotifyClient.getCurrentUser();
        const date = new Date();
        const playlistName = `${discogsUsername} ${inventoryType} - ${date.toLocaleDateString()} - ${date.getHours()}:${date.getMinutes()}`;
        return this.spotifyClient.createPlaylist(user.id, playlistName);
    }

    async iterateInventory(
        discogsUsername: string,
        playlist: CreatePlaylistResponse,
        inventoryType: InventoryType,
        page: number,
    ): Promise<void> {
        const inventory = await this.discogsClient.getInventory(discogsUsername, inventoryType, page);

        for (const listing of inventory.items) {
            void (await this.addTracksFromListingIntoPlaylist(listing, playlist));
        }

        if (page < inventory.pagination.pages) {
            await this.iterateInventory(discogsUsername, playlist, inventoryType, inventory.pagination.page + 1);
        }
    }

    async addTracksFromListingIntoPlaylist(listing: InventoryItem, playlist: CreatePlaylistResponse): Promise<void> {
        console.log(`searching for ${listing.title} by ${listing.artist}`);
        const spotifyTrack = await this.spotifyClient.searchForTrack(`${listing.artist} ${listing.title}`);
        if (spotifyTrack && spotifyTrack.albums?.items.length === 1) {
            console.log(`retrieving album ${listing.title}`);
            const album = await this.spotifyClient.getAlbum(spotifyTrack.albums?.items[0].id);
            await this.spotifyClient.addItemsToPlaylist(
                playlist.id,
                album.tracks.items.map((i) => i.uri),
            );
        }
    }
}
