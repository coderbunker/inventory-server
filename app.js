const express = require('express');
const https = require('https');
const fs = require('fs');

const qr = require('qr-image');

const {
  loadDatabase,
  searchDatabase,
  addMarkdown,
  addSimilarItems,
} = require('./googleSpreadsheet');

const app = express();

const allScans = [];

const key = fs.readFileSync('encryption/coderbunker-private.key');
const cert = fs.readFileSync('encryption/coderbunker.crt');
const sslforfree = fs.readFileSync('encryption/sslforfree-verification.bin');

const options = {
  key,
  cert,
  ca: cert,
};

function logScanned(uuid, fixture) {
  // TRICK: fixture tells if the the uuid was found in database or not
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)) {
    return;
  }
  const now = new Date();
  if (!fixture) {
    allScans.unshift({ time: now, status: 'missing', uuid });
    return;
  }
  allScans.map((item) => {
    const itm = item;
    itm.status = (itm.uuid === uuid) ? 'fixed' : itm.status;
    return itm;
  });
  allScans.unshift({ time: now, fixture, uuid });
}

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));

const port = process.env.PORT || 1234;
const httpsport = process.env.HTTPSPORT || 1235;
app.use((req, res, next) => {
  if (!/https/.test(req.protocol)) {
    res.redirect(`https://${req.headers.host.replace(/[0-9]/g, '')}${httpsport}${req.url}`);
  } else {
    return next();
  }
});

app.get(['/favicon.ico', '/robots.txt'], (req, res) => {
  res.sendStatus(204);
});

app.get('/search', (req, res) => {
  loadDatabase((allItems) => {
    res.render('search', {
      matches: searchDatabase(req.query, allItems)
        .sort((a, b) => (a.floor === b.floor ? 0 : +(a.floor > b.floor) || -1)),
    });
  });
});

app.get('/qrlist', (req, res) => {
  loadDatabase((allItems) => {
    const qrList = searchDatabase(req.query, allItems)
      .filter(item => item.uuid !== '')
      .filter(item => item.uuid !== undefined)
      .sort((a, b) => (a.floor === b.floor ? 0 : +(a.floor > b.floor) || -1));
    qrList.forEach((item) => {
      const itm = item;
      itm.qr = qr.imageSync(`http://url.coderbunker.com/${itm.uuid}`, { type: 'svg' });
      return itm;
    });
    res.render('qrList', { matches: qrList });
  });
});

app.get('/recent', (req, res) => {
  res.render('recent', { allScans });
});


app.get('/.well-known/acme-challenge/tKNA6OSB1Ug5zig7rEbF0FlFwilsZaNC-8-5iJeZGXo', (req, res) => {
  res.send(sslforfree);
});

app.get('/:uuid', (req, res) => {
  loadDatabase((allItems) => {
    const match = searchDatabase(req.params, allItems)[0];
    if (match === undefined) {
      logScanned(req.params.uuid);
      res.status(404).render('notFound', {
        item: '',
        id: req.params.uuid,
      });
      return;
    }
    addMarkdown(match);
    addSimilarItems(match, allItems);
    logScanned(req.params.uuid, match.fixture);
    res.render('item', match);
  });
});

app.get('/', (req, res) => {
  res.render('home', {});
});

app.listen(port, () => {
  console.log(`working on ${port}`);
});

https.createServer(options, app).listen(httpsport);
