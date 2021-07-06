#!/usr/bin/env node

// import path from 'path';
// import index from './callback/index';
import { Command } from 'commander';
import Service from './service';

const program = new Command();
const service = new Service();

program
    .arguments('<username>')
    .description('discogs-crate-digger', {
        username: 'the marketplace user you want to dig through',
    })
    .action((username: string) => {
        const inventory = service.run(username);
        void inventory.then((res) => console.log(res));
    });

program.parse();
