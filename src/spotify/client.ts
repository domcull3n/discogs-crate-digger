import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AddItemsToPlaylistResponse, CreatePlaylistRequest, CreatePlaylistResponse } from './models/playlists';
import { SearchResponse, Track } from './models/search';
import { CurrentUserResponse } from './models/user';

export default class SpotifyClient {

    private _axios: AxiosInstance;

    constructor(token: string) {
        this._axios = axios.create({
            baseURL: 'https://accounts.spotify.com',
            timeout: 5000,
            headers: { 'Authorization': `Bearer ${token}` }
        })
        this._axios.interceptors.response.use((res) => res.data)
    }

    async getCurrentUser(): Promise<CurrentUserResponse> {
        const config: AxiosRequestConfig = {
            baseURL: 'https://api.spotify.com',
            url: '/v1/me',
            method: 'get'
        }

        return this._axios.request<CurrentUserResponse, CurrentUserResponse>(config)
    }

    async createPlaylist(user: string, playlistName: string): Promise<CreatePlaylistResponse> {
        const request: CreatePlaylistRequest = {
            collaborative: false,
            name: playlistName,
            description: `Description of ${playlistName}`,
            public: false
        }

        const config: AxiosRequestConfig = {
            url: `/v1/users/${user}/playlists`,
            method: 'post',
            params: request
        }

        return this._axios.request<CreatePlaylistResponse, CreatePlaylistResponse>(config)
    }

    async addItemsToPlaylist(playlistId: string, tracks: string[]): Promise<AddItemsToPlaylistResponse> {
        const config: AxiosRequestConfig = {
            url: `/v1/playlists/${playlistId}/tracks`,
            method: 'post',
            params: { uris: tracks }
        }

        return this._axios.request<AddItemsToPlaylistResponse, AddItemsToPlaylistResponse>(config)
    }

    async searchForTrack(search: string): Promise<SearchResponse<Track>> {
        const config: AxiosRequestConfig = {
            url: '/v1/search',
            method: 'get',
            params: { q: search }
        }

        return this._axios.request<SearchResponse<Track>, SearchResponse<Track>>(config)
    }

}