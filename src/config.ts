import * as dotenv from 'dotenv';

dotenv.config();

export const discogsApiKey: string | undefined = process.env.DISCOGS_API_KEY;
export const spotifyClientId: string | undefined = process.env.SPOTIFY_CLIENT_ID;
