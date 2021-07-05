import Crypto from 'crypto';
import base64url from 'base64url';
import { spotifyClientId } from '../config';

const redirectUri = 'http://localhost:8000/callback';
const scopes = ['playlist-modify-public', 'playlist-modify-private'].join('%20');

export const generateAuthUrl = (): string => {
    if (spotifyClientId === undefined) throw new Error('spotify client ID not found in env file');

    const codeVerifier = Crypto.randomBytes(64).toString('base64').slice(0, 64);
    const codeChallenge = base64url.fromBase64(Crypto.createHash('sha256').update(codeVerifier).digest('base64'));
    const state = Math.random().toString(36).substring(7);

    return `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=code&redirect_uri=${redirectUri}&code_challenge_method=S256&code_challenge=${codeChallenge}&state=${state}&scope=${scopes}`;
};

export const generateImplicitAuthUrl = (): string => {
    if (spotifyClientId === undefined) throw new Error('spotify client ID not found in env file');

    const state = Math.random().toString(36).substring(7);
    return `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=token&redirect_uri=${redirectUri}&state=${state}&scope=${scopes}`;
};
