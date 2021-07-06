import DiscogsClient from './discogs/client';
import { Inventory } from './discogs/models/marketplace';

export default class Service {
    private discogsClient: DiscogsClient;

    constructor() {
        this.discogsClient = new DiscogsClient();
    }

    async run(discogsUsername: string): Promise<Inventory> {
        return await this.discogsClient.getInventory(discogsUsername);
    }
}
