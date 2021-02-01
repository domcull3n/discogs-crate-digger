import { Inventory } from './models/marketplace';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { discogsApiKey } from '../config';

export default class DiscogsClient {

    private _axios: AxiosInstance;

    constructor() {
        this._axios = axios.create({
            baseURL: 'https://api.discogs.com',
            timeout: 5000,
            headers: { 'User-Agent': 'discogs-crate-digger:0.1', 'Authorization': discogsApiKey }
        })
        this._axios.interceptors.response.use((res) => res.data)
    }

    async getInventory(username: string) : Promise<Inventory> {
        const config: AxiosRequestConfig = {
            url: `/users/${username}/inventory`,
            method: 'get'
        }

        return this._axios.request<Inventory, Inventory>(config)
    }

}