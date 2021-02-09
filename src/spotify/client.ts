import axios, { AxiosInstance } from 'axios';

export default class SpotifyClient {

    private _axios: AxiosInstance;

    constructor() {
        this._axios = axios.create({
            baseURL: 'https://accounts.spotify.com',
            timeout: 5000
        })
        this._axios.interceptors.response.use((res) => res.data)
    }

    

}