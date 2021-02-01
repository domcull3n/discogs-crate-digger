import Pagination from './pagination';

export interface InventoryRequest {
    username: string,
    status: string,
    sort: string,
    sort_order: string
}

export interface Inventory {
    pagination: Pagination,
    listings: Listing[]
}

interface Listing {
    release: Release
}

interface Release {
    description: string,
    artist: string,
    title: string,
    year: number,
    id: number,
    resource_url: string,
}