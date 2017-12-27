const express = require('express');

const qr = require('qr-image');

const {
  searchDatabase,
  addMarkdown,
  addSimilarItems,
} = require('./googleSpreadsheet');

const app = express();

const allScans = new Map();

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));

app.get(['/favicon.ico', '/robots.txt'], (req, res) => {
  res.sendStatus(204);
});


function addRecentlyScanned(uuid, item, nbFound = 0) {
  // TRICK: only record uuids
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)) {
    return;
  }
  const duplicatedItem = item;
  duplicatedItem.time = new Date();
  duplicatedItem.duplicated = nbFound > 1;
  duplicatedItem.link = item.cellRef;
  if (nbFound === 0) {
    duplicatedItem.fixture = '';
    duplicatedItem.uuid = uuid;
    duplicatedItem.status = 'missing';
  }
  allScans.set(uuid, duplicatedItem);
}

app.get('/search', (req, res) => {
  searchDatabase(req.query, queryResult => res.render('search', {
    matches: queryResult.sort((a, b) => (a.floor === b.floor ? 0 : +(a.floor > b.floor) || -1)),
  }));
});

app.get('/qrlist', (req, res) => {
  function renderQrList(qrList) {
    const qrItems = qrList.filter(item => item.uuid !== '')
      .filter(item => item.uuid !== undefined)
      .sort((a, b) => (a.floor === b.floor ? 0 : +(a.floor > b.floor) || -1));
    qrItems.forEach((item) => {
      const itemWithQr = item;
      itemWithQr.qr = qr.imageSync(item.uuid, { type: 'svg' });
      return itemWithQr;
    });
    res.render('qrList', { matches: qrItems });
  }
  searchDatabase(req.query, queryResult => renderQrList(queryResult));
});

app.get('/recent', (req, res) => {
  res.render('recent', { allScans });
});

app.get('/:uuid', (req, res) => {
  function renderUuid(uuidsList) {
    let uuids = uuidsList[0];
    if (uuidsList.length === 0) {
      addRecentlyScanned(req.params.uuid, {});
      res.status(404).render('notFound', {
        item: '',
        id: req.params.uuid,
      });
      return;
    }
    if (uuidsList.length > 1) {
      console.log(`Too much matches for uuid ${req.params.uuid} length = ${uuidsList.length}`);
    }
    // copying twice just to remove a lint warning (no-param-reassign):  bad bad bad !
    uuids = addMarkdown(uuids);
    uuids = addSimilarItems(uuids);
    addRecentlyScanned(req.params.uuid, uuids, uuidsList.length);
    res.render('item', uuids);
  }
  searchDatabase(req.params, queryResult => renderUuid(queryResult));
});

app.get('/', (req, res) => {
  res.render('home', {});
});

const port = process.env.PORT || 1234;

app.listen(port, () => {
  console.log(`working on ${port}`);
});
