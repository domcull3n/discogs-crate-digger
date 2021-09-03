import { assert } from 'chai';
import DiscogsClient from '../../src/discogs/client';
import { Inventory } from '../../src/discogs/models/marketplace';

describe('DiscogsClient', () => {
    it('should return an inventory', async () => {
        const discogsClient = new DiscogsClient();
        const inventory: Inventory = await discogsClient.getInventory('crazybeatrecords', 1);

        assert(inventory != null);
    });
});
