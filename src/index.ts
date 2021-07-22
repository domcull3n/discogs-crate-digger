#!/usr/bin/env node

import index from './callback/index';
import { Command } from 'commander';

const program = new Command();

program
    .arguments('<username>')
    .description('discogs-crate-digger', {
        username: 'the marketplace user you want to dig through',
    })
    .action((username: string) => {
        try {
            index(username.toLowerCase());
        } catch (error) {
            console.log('an error has occured, please try again later.');
        }
    });

program.parse(process.argv);
