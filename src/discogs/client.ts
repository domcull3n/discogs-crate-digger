import { Inventory } from './models/marketplace';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export default class DiscogsClient {
    private axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
            baseURL: 'https://api.discogs.com',
            timeout: 5000,
            headers: {
                'User-Agent': 'discogs-crate-digger:0.1'
            },
        });
        this.axios.interceptors.response.use(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            (res) => res.data,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (err) => console.log(err.response),
        );
    }

    async getInventory(username: string): Promise<Inventory> {
        const config: AxiosRequestConfig = {
            url: `/users/${username}/inventory`,
            method: 'get',
        };

        return this.axios.request<Inventory, Inventory>(config);
    }
}
