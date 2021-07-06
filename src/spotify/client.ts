/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Album } from './models/album';
import { AddItemsToPlaylistResponse, CreatePlaylistRequest, CreatePlaylistResponse } from './models/playlists';
import { SearchResponse, Track } from './models/search';
import { CurrentUserResponse } from './models/user';

export default class SpotifyClient {
    private axios: AxiosInstance;

    constructor(token: string) {
        this.axios = axios.create({
            baseURL: 'https://api.spotify.com',
            timeout: 5000,
            headers: { authorization: `Bearer ${token}` },
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        this.axios.interceptors.response.use(res => res.data, err => console.log(err?.response));
    }

    async getCurrentUser(): Promise<CurrentUserResponse> {
        const config: AxiosRequestConfig = {
            url: '/v1/me',
            method: 'get',
        };

        return this.axios.request<CurrentUserResponse, CurrentUserResponse>(config);
    }

    async createPlaylist(user: string, playlistName: string): Promise<CreatePlaylistResponse> {
        const request: CreatePlaylistRequest = {
            collaborative: false,
            name: playlistName,
            description: `Description of ${playlistName}`,
            public: false,
        };

        const config: AxiosRequestConfig = {
            url: `/v1/users/${user}/playlists`,
            method: 'post',
            data: request,
        };

        return this.axios.request<CreatePlaylistResponse, CreatePlaylistResponse>(config);
    }

    async addItemsToPlaylist(playlistId: string, tracks: string[]): Promise<AddItemsToPlaylistResponse> {
        const config: AxiosRequestConfig = {
            url: `/v1/playlists/${playlistId}/tracks`,
            method: 'post',
            data: { uris: tracks },
        };

        return this.axios.request<AddItemsToPlaylistResponse, AddItemsToPlaylistResponse>(config);
    }

    async searchForTrack(search: string): Promise<SearchResponse<Track>> {
        const config: AxiosRequestConfig = {
            url: '/v1/search',
            method: 'get',
            params: { q: search, type: 'album' },
        };

        return this.axios.request<SearchResponse<Track>, SearchResponse<Track>>(config);
    }

    async getAlbum(albumId: string): Promise<Album> {
        const config: AxiosRequestConfig = {
            url: `/v1/albums/${albumId}`,
            method: 'get',
        };

        return this.axios.request<Album, Album>(config);
    }
}
