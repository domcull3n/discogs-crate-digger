import express from 'express';
import open from 'open';
import { Logger } from 'sitka';
import { generateImplicitAuthUrl } from '../spotify/util';

const logger = Logger.getLogger();

const app = express();

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
        logger.info('token: ' + token);
    }
});

export default (): void => {
    app.listen(8000, () => {
        void open(generateImplicitAuthUrl());
    });
};
