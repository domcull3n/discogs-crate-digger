import * as dotenv from 'dotenv';

dotenv.config();

export const spotifyClientId: string | undefined = process.env.SPOTIFY_CLIENT_ID;
