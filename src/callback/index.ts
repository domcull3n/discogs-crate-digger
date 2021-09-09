import express from 'express';
import open from 'open';
import { Logger } from 'sitka';
import { CommandOptions } from '../models';
import Service from '../service';
import { generateImplicitAuthUrl } from '../spotify/util';

const logger = Logger.getLogger();

const app = express();

export default (commandOptions: CommandOptions): void => {
    app.listen(8000, () => {
        app.get('/callback', (req, res) => {
            res.sendFile(__dirname + '/callback.html');
            if (req.query.error) {
                logger.info('Error: ', req.query.error);
            }
        });

        app.get('/token', (req, res) => {
            res.sendStatus(200);
            const token = req.query.access_token?.toString();
            if (token) {
                const service = new Service(token);
                void service
                    .run(commandOptions.username, commandOptions.inventoryType)
                    .then(() => {
                        console.log(
                            `finished processing playlist for ${commandOptions.username} discogs ${commandOptions.inventoryType}`,
                        );
                        process.exit(0);
                    })
                    .catch(() => {
                        console.log('an error has occured, please try again later');
                        process.exit(1);
                    });
            }
        });

        void open(generateImplicitAuthUrl());
    });
};
