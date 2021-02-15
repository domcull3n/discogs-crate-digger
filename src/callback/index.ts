import express from 'express';
import open from 'open';
import { Logger } from 'sitka';
import SpotifyClient from '../spotify/client';
import { CurrentUserResponse } from '../spotify/models/user';
import { generateImplicitAuthUrl } from '../spotify/util';

const logger = Logger.getLogger();

const app = express();

app.get('/callback', (req, res) => {
	res.sendFile(__dirname + '/callback.html')
	if (req.query.error) {
		logger.info('Error: ', req.query.error)
	}
});

app.get('/token', async (req, res) => {
  res.sendStatus(200)
  const token = req.query.access_token?.toString()
  if (token) {
    logger.info('token: ' + token)
  }

})

export default () => {
	app.listen(8000, () => {
		open(generateImplicitAuthUrl());
	})
}
