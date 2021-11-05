require('dotenv').config();
const express = require('express');
const expressSession = require('express-session');
const morgan = require('morgan');
const path = require('path');
const pgSession = require('connect-pg-simple')(expressSession);
const uuid = require('uuid').v4;

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
app.use(expressSession({
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: '/',
    secure: false
  },
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  store: new pgSession({
    createTableIfMissing: true
  })
}));

// Extract session info on every request
app.use((req, res, next) => {
  res.locals.nameQueried = req.session.nameQueried;

  let fakeSessionId = req.session.fakeSessionId;

  if (!fakeSessionId) {
    fakeSessionId = uuid();
    req.session.fakeSessionId = fakeSessionId;
  }

  res.locals.fakeSessionId = fakeSessionId;

  next();
});

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

    req.session.nameQueried = normalizedName;

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

app.get('/user', async (req, res) => {
  const name = res.locals.nameQueried;
  const fakeSessionId = res.locals.fakeSessionId;

  const userData = {
    query: null,
    fakeSessionId: fakeSessionId
  };

  if (name) {
    userData.query = await getNameData(name);
  }

  res.status(200).json(userData);
});

app.post('/session/destroy', async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }

    res.redirect('/user');
  });
});

// Send all other get requests to the index page
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, host, () => {
  console.log(`App is listening on port ${port} of ${host}!`);
});
