/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import DiscogsClient from './discogs/client';
import SpotifyClient from './spotify/client';

export default class Service {
    private discogsClient: DiscogsClient;
    private spotifyClient: SpotifyClient;

    constructor(spotifyToken: string) {
        this.discogsClient = new DiscogsClient();
        this.spotifyClient = new SpotifyClient(spotifyToken);
    }

    run(discogsUsername: string): void {
        void Promise.all([this.discogsClient.getInventory(discogsUsername), this.spotifyClient.getCurrentUser()])
            .then((results) => {
                const user = results[1];
                const date = new Date();
                const playlistName = `${discogsUsername} marketplace - ${date.toLocaleDateString()} - ${date.getMinutes()}:${date.getHours()}`;
                void this.spotifyClient.createPlaylist(user.id, playlistName);
            })
            .catch((error) => console.log(error));
    }
}
