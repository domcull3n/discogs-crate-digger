export default interface Pagination {
    per_page: number,
    items: number,
    page: number,
    urls: {
        last: string,
        next: string
    },
    pages: number
}