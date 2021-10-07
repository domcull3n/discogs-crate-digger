import DiscogsClient from './discogs/client';
import { Inventory, InventoryItem } from './discogs/models/generic';
import { InventoryType } from './models';
import SpotifyClient from './spotify/client';
import { CreatePlaylistResponse } from './spotify/models/playlists';

export default class Service {
    private discogsClient: DiscogsClient;
    private spotifyClient: SpotifyClient;
    private missingAlbums: string[] = [];

    constructor(spotifyToken: string) {
        this.discogsClient = new DiscogsClient();
        this.spotifyClient = new SpotifyClient(spotifyToken);
    }

    async run(discogsUsername: string, inventoryType: InventoryType, genresToFilter: string[]): Promise<void> {
        const playlist = await this.createPlaylist(discogsUsername, inventoryType);
        const inventory = await this.iterateInventory(discogsUsername, playlist, inventoryType, genresToFilter, 1);
        await this.updatePlaylistDescriptionWithMissingAlbums(playlist, inventory.pagination.items);
    }

    async createPlaylist(discogsUsername: string, inventoryType: InventoryType): Promise<CreatePlaylistResponse> {
        const user = await this.spotifyClient.getCurrentUser();
        const date = new Date();
        const playlistName = `${discogsUsername} ${inventoryType} - ${date.toLocaleDateString()} - ${date.getHours()}:${date.getMinutes()}`;
        return this.spotifyClient.createPlaylist(user.id, playlistName);
    }

    private filterInventoryItems(inventory: Inventory, genresToFilter: string[]): InventoryItem[] {
        if (genresToFilter.length === 0) return inventory.items;

        return inventory.items.filter((listing) => {
            const listingSet = new Set(listing.genres);
            const genresSet = new Set(genresToFilter);
            return listingSet.size === genresSet.size && [...genresSet].every((g) => listingSet.has(g));
        });
    }

    async iterateInventory(
        discogsUsername: string,
        playlist: CreatePlaylistResponse,
        inventoryType: InventoryType,
        genresToFilter: string[],
        page: number,
    ): Promise<Inventory> {
        const inventory = await this.discogsClient.getInventory(discogsUsername, inventoryType, page);
        const filteredInventoryItems = this.filterInventoryItems(inventory, genresToFilter);

        for (const listing of filteredInventoryItems) {
            void (await this.addTracksFromListingIntoPlaylist(listing, playlist));
        }

        if (page < inventory.pagination.pages) {
            await this.iterateInventory(
                discogsUsername,
                playlist,
                inventoryType,
                genresToFilter,
                inventory.pagination.page + 1,
            );
        }

        return inventory;
    }

    async addTracksFromListingIntoPlaylist(listing: InventoryItem, playlist: CreatePlaylistResponse): Promise<void> {
        console.log(`searching for ${listing.title} by ${listing.artist}`);
        const spotifyTrack = await this.spotifyClient.searchForTrack(`${listing.artist} ${listing.title}`);
        if (spotifyTrack && spotifyTrack.albums?.items.length === 1) {
            console.log(`adding album ${listing.title} to playlist`);
            const album = await this.spotifyClient.getAlbum(spotifyTrack.albums?.items[0].id);
            await this.spotifyClient.addItemsToPlaylist(
                playlist.id,
                album.tracks.items.map((i) => i.uri),
            );
        } else {
            console.log(`cannot find ${listing.title}`);
            this.missingAlbums.push(listing.title);
        }
    }

    async updatePlaylistDescriptionWithMissingAlbums(
        playlist: CreatePlaylistResponse,
        totalDiscogsAlbums: number,
    ): Promise<void> {
        const newDescription = `Missing Albums: ${this.missingAlbums.join(' | ')}`;
        if (newDescription.length <= 300) {
            return this.spotifyClient.updatePlaylist(playlist.id, newDescription);
        }

        return this.spotifyClient.updatePlaylist(
            playlist.id,
            `Number of Missing Albums: ${this.missingAlbums.length}/${totalDiscogsAlbums}`,
        );
    }
}
