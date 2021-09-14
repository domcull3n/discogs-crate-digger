#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import index from './callback/index';
import { Command, Option } from 'commander';
import { DiscogsMainGenres, InventoryType } from './models';

const program = new Command();

program
    .argument('<username>', "the user who's marketplace/collection you want to dig through")
    .option('--collection', 'dig through the users collection if public (default is marketplace)')
    .addOption(
        new Option(
            '--genres <genres...>',
            "genre's to pull out of the specified collection (only works with collections)",
        ).choices(DiscogsMainGenres),
    )

    .action((username: string, options) => {
        if (options.collection === undefined && options.genres !== undefined) {
            console.error("Genre's can't be specified with an marketplace, only an inventory");
            console.error('Exiting...');
            return;
        }
        try {
            index({
                username: username.toLowerCase(),
                inventoryType: options.collection ? InventoryType.COLLECTION : InventoryType.MARKETPLACE,
                discogsGenres: options.genres,
            });
        } catch (error) {
            console.error('an error has occured, please try again later.');
        }
    });

program.parse(process.argv);
