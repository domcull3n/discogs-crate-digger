import Pagination from './pagination';

export interface CollectionInventory {
    pagination: Pagination;
    releases: CollectionRelease[];
}

export interface CollectionRelease {
    id: number;
    instance_id: number;
    basic_information: {
        title: string;
        artists: {
            name: string;
        }[];
    };
}
