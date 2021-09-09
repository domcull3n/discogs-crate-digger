import Pagination from './pagination';

export interface Inventory {
    pagination: Pagination;
    items: InventoryItem[];
}

export interface InventoryItem {
    artist: string;
    title: string;
}
