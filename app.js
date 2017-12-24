const express = require('express');

const qr = require('qr-image');

const {
  loadDatabase,
  searchDatabase,
  addMarkdown,
  addSimilarItems,
} = require('./googleSpreadsheet');

const app = express();

const allScans = [];

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
  allScans.map(item => item.status = (item.uuid === uuid) ? 'fixed' : item.status);
  allScans.unshift({ time: now, fixture, uuid });
}

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));

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
    qrList.forEach(item => item.qr = qr.imageSync('http://url.coderbunker.com/' + item.uuid, { type: 'svg' }));
    res.render('qrList', { matches: qrList });
  });
});

app.get('/recent', (req, res) => {
  res.render('recent', { allScans });
});

app.get('/:uuid', (req, res) => {
  loadDatabase((allItems) => {
    const match = searchDatabase(req.params, allItems)[0];
    if (match.length === 0) {
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

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`working on ${port}`);
});
