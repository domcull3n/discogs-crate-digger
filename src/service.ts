import DiscogsClient from './discogs/client';
import { Listing } from './discogs/models/marketplace';
import SpotifyClient from './spotify/client';
import { CreatePlaylistResponse } from './spotify/models/playlists';

export default class Service {
    private discogsClient: DiscogsClient;
    private spotifyClient: SpotifyClient;

    constructor(spotifyToken: string) {
        this.discogsClient = new DiscogsClient();
        this.spotifyClient = new SpotifyClient(spotifyToken);
    }

    async run(discogsUsername: string): Promise<void> {
        const playlist = await this.createPlaylist(discogsUsername);
        await this.iterateInventory(discogsUsername, playlist, 1);
    }

    async iterateInventory(discogsUsername: string, playlist: CreatePlaylistResponse, page: number): Promise<void> {
        const inventory = await this.discogsClient.getInventory(discogsUsername, page);

        for (const listing of inventory.listings) {
            void (await this.addTracksFromListingIntoPlaylist(listing, playlist));
        }

        if (page < inventory.pagination.pages) {
            await this.iterateInventory(discogsUsername, playlist, inventory.pagination.page + 1);
        }
    }

    async addTracksFromListingIntoPlaylist(listing: Listing, playlist: CreatePlaylistResponse): Promise<void> {
        console.log(`searching for ${listing.release.title} by ${listing.release.artist}`);
        const spotifyTrack = await this.spotifyClient.searchForTrack(
            `${listing.release.artist} ${listing.release.title}`,
        );
        if (spotifyTrack && spotifyTrack.albums?.items.length === 1) {
            console.log(`retrieving album ${listing.release.title}`);
            const album = await this.spotifyClient.getAlbum(spotifyTrack.albums?.items[0].id);
            await this.spotifyClient.addItemsToPlaylist(
                playlist.id,
                album.tracks.items.map((i) => i.uri),
            );
        }
    }

    async createPlaylist(discogsUsername: string): Promise<CreatePlaylistResponse> {
        const user = await this.spotifyClient.getCurrentUser();
        const date = new Date();
        const playlistName = `${discogsUsername} marketplace - ${date.toLocaleDateString()} - ${date.getHours()}:${date.getMinutes()}`;
        return this.spotifyClient.createPlaylist(user.id, playlistName);
    }
}
