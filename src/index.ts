#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import index from './callback/index';
import { Command } from 'commander';
import { InventoryType } from './models';

const program = new Command();

program
    .argument('<username>', "the user who's marketplace/collection you want to dig through")
    .option('--collection', 'dig through the users collection if public (default is marketplace)')
    .action((username: string, options) => {
        try {
            index({
                username: username.toLowerCase(),
                inventoryType: options.collection ? InventoryType.COLLECTION : InventoryType.MARKETPLACE,
            });
        } catch (error) {
            console.log('an error has occured, please try again later.');
        }
    });

program.parse(process.argv);
