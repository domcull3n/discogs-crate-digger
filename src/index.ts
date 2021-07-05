#!/usr/bin/env node

// import path from 'path';
// import index from './callback/index';
import { Command } from 'commander';

const program = new Command();
program
    .arguments('<username>')
    .description('discogs-crate-digger', {
        username: 'the marketplace user you want to dig through',
    })
    .action((username: string) => {
        console.log(username);
    });

program.parse();
