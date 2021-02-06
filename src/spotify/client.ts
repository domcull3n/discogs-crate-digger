import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Crypto from 'crypto';
import base64url from 'base64url';
import { spotifyClientId } from '../config';

export default class SpotifyClient {

    private _axios: AxiosInstance;
    private _redirectUri = 'http://localhost:8000/callback';
    private _scopes = [
        'playlist-modify-public',
        'playlist-modify-private'
    ].join(' ');

    constructor() {
        this._axios = axios.create({
            baseURL: 'https://accounts.spotify.com',
            timeout: 5000
        })
        this._axios.interceptors.response.use((res) => res.data)
    }

    async authorize() : Promise<any> {
        const codeVerifier = Crypto.randomBytes(64).toString('base64').slice(0, 64);
        const codeChallenge = base64url.fromBase64(Crypto.createHash('sha256').update(codeVerifier).digest('base64'));
        const state = Math.random().toString(36).substring(7);

        const config: AxiosRequestConfig = {
            url: `/authorize`,
            method: 'get',
            params: {
                client_id: spotifyClientId,
                response_type: 'code',
                redirect_uri: this._redirectUri,
                code_challenge_method: 'S256',
                code_challenge: codeChallenge,
                state: state,
                scope: this._scopes
            }
        }

        return this._axios.request<any, any>(config)
    }

}