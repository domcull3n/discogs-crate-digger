/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inventory } from './models/marketplace';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as rax from 'retry-axios';

export default class DiscogsClient {
    private axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
            baseURL: 'https://api.discogs.com',
            timeout: 5000,
            headers: {
                'User-Agent': 'discogs-crate-digger:0.1',
            },
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

    async getInventory(username: string, page: number): Promise<Inventory> {
        const config: AxiosRequestConfig = {
            url: `/users/${username}/inventory`,
            method: 'get',
            params: { page, per_page: 100 },
        };

        return this.axios.request<Inventory, Inventory>(config);
    }
}
