/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MarketplaceInventory } from './models/marketplace';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as rax from 'retry-axios';
import { CollectionInventory } from './models/collection';
import { Inventory } from './models/generic';
import { InventoryType } from '../models';

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

    async getInventory(username: string, inventoryType: InventoryType, page: number): Promise<Inventory> {
        switch (inventoryType) {
            case InventoryType.MARKETPLACE:
                return this.getMarketplaceInventory(username, page);
            case InventoryType.COLLECTION:
                return this.getCollection(username, page);
        }
    }

    async getMarketplaceInventory(username: string, page: number): Promise<Inventory> {
        const config: AxiosRequestConfig = {
            url: `/users/${username}/inventory`,
            method: 'get',
            params: { page, per_page: 100 },
        };

        const inventory = await this.axios.request<MarketplaceInventory, MarketplaceInventory>(config);
        return {
            pagination: inventory.pagination,
            items: inventory.listings.map((item) => {
                return {
                    artist: item.release.artist,
                    title: item.release.title,
                    genres: [],
                };
            }),
        };
    }

    async getCollection(username: string, page: number): Promise<Inventory> {
        const config: AxiosRequestConfig = {
            url: `users/${username}/collection/folders/0/releases`,
            method: 'get',
            params: { page, per_page: 100 },
        };

        const collection = await this.axios.request<CollectionInventory, CollectionInventory>(config);
        return {
            pagination: collection.pagination,
            items: collection.releases.map((item) => {
                return {
                    artist: item.basic_information.artists[0].name,
                    title: item.basic_information.title,
                    genres: item.basic_information.genres,
                };
            }),
        };
    }
}
