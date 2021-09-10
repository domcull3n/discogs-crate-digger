import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as rax from 'retry-axios';
import { GetAlbumResponse } from './models/album';
import { AddItemsToPlaylistResponse, CreatePlaylistRequest, CreatePlaylistResponse } from './models/playlists';
import { SearchResponse, Track } from './models/search';
import { CurrentUserResponse } from './models/user';

export default class SpotifyClient {
    private axios: AxiosInstance;

    constructor(token: string) {
        this.axios = axios.create({
            baseURL: 'https://api.spotify.com',
            headers: { authorization: `Bearer ${token}` },
        });
        this.axios.defaults.raxConfig = {
            instance: this.axios,
            retry: 1,
            retryDelay: 60000,
            backoffType: 'static',
        };
        rax.attach(this.axios);
        this.axios.interceptors.response.use(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            (res) => res.data,
        );
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
            public: false,
        };

        const config: AxiosRequestConfig = {
            url: `/v1/users/${user}/playlists`,
            method: 'post',
            data: request,
        };

        return this.axios.request<CreatePlaylistResponse, CreatePlaylistResponse>(config);
    }

    async updatePlaylist(playlistId: string, description: string): Promise<void> {
        const config: AxiosRequestConfig = {
            url: `/v1/playlists/${playlistId}`,
            method: 'put',
            data: {
                description,
            },
        };

        return this.axios.request<void, void>(config);
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

    async getAlbum(albumId: string): Promise<GetAlbumResponse> {
        const config: AxiosRequestConfig = {
            url: `/v1/albums/${albumId}`,
            method: 'get',
        };

        return this.axios.request<GetAlbumResponse, GetAlbumResponse>(config);
    }
}
