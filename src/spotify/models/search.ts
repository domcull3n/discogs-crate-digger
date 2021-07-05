export interface Track {
    id: string;
    href: string;
    external_ids: string;
    external_urls: string;
    uri: string;
}

export interface SearchRequest {
    q: string;
    type: string;
    limit: number;
    offset: number;
}

export interface SearchResponse<T> {
    tracks?: PagingWrapper<T>;
}

interface PagingWrapper<T> {
    items: T[];
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
}
