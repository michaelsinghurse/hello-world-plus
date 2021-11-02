require('dotenv').config();
const express = require('express');
const expressSession = require('express-session');
const morgan = require('morgan');
const path = require('path');
const pgSession = require('connect-pg-simple')(expressSession);

const { isValidName, normalizeName } = require('./lib/utils.js');
const {
  getHistoryData,
  getHistoryDataForName,
  getNameData,
  setNameData,
  nameHasBeenScraped,
  setNameRequest
} = require('./lib/persistence.js');
const { scrapeNameMeaning } = require('./lib/nameScraper.js');

const app = express();
const host = process.env.HOST;
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(morgan('short'));

app.get('/name', async (req, res) => {
  const name = req.query.q.trim();

  if (isValidName(name)) {
    const normalizedName = normalizeName(name);

    await setNameRequest(normalizedName, req.ip);

    const hasBeenScraped = await nameHasBeenScraped(normalizedName);

    if (!hasBeenScraped) {
      const scrapedData = await scrapeNameMeaning(normalizedName);

      await setNameData(normalizedName, scrapedData);
    }

    const nameData = await getNameData(normalizedName);

    res.status(200).json(nameData);
  } else {
    res.status(400).send('Invalid name');
  }
});

app.get('/history', async (req, res) => {
  const limit = Number(req.query.limit) || 10;

  const historyData = await getHistoryData(limit);

  res.status(200).json(historyData);
});

app.get('/history/:id', async (req, res) => {
  const nameId = Number(req.params.id);

  const historyData = await getHistoryDataForName(nameId);

  res.status(200).json(historyData);
});

// Send all other get requests to the index page
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, host, () => {
  console.log(`App is listening on port ${port} of ${host}!`);
});
