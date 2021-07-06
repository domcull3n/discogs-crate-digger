/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import { exit } from 'process';
import DiscogsClient from './discogs/client';
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
        const inventory = await this.discogsClient.getInventory(discogsUsername);

        // const listing = inventory.listings[0];
        // console.log(`searching for ${listing.release.title} by ${listing.release.artist}`)
        // const spotifyTrack = await this.spotifyClient.searchForTrack(`${listing.release.artist} ${listing.release.title}`);
        // const spotifyTrackAlbum = spotifyTrack.albums?.items[0];
        // if (spotifyTrackAlbum !== undefined) {
        //     const album = await this.spotifyClient.getAlbum(spotifyTrackAlbum?.id)
        //     console.log(album.tracks);
        // }

        inventory.listings.map(async (listing) => {
            const spotifyTrack = await this.spotifyClient.searchForTrack(`${listing.release.artist} ${listing.release.title}`);
            console.log(`searching for ${listing.release.title} by ${listing.release.artist}`)
            if (spotifyTrack.albums?.items.length === 1) {
                const album = await this.spotifyClient.getAlbum(spotifyTrack.albums?.items[0].id);
                void await this.spotifyClient.addItemsToPlaylist(playlist.id, album.tracks.items.map(i => i.uri));
            }
        });

        console.log('done processing')
    }

    async createPlaylist(discogsUsername: string): Promise<CreatePlaylistResponse> {
        const user = await this.spotifyClient.getCurrentUser();
        const date = new Date();
        const playlistName = `${discogsUsername} marketplace - ${date.toLocaleDateString()} - ${date.getHours()}:${date.getMinutes()}`;
        return this.spotifyClient.createPlaylist(user.id, playlistName);
    }
}
