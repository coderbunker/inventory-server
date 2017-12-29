const express = require('express');


const {
  loadDatabase,
  searchDatabase,
  addMarkdown,
  addSimilarItems,
} = require('./googleSpreadsheet');

const app = express();

const allScans = new Map();

function addRecentlyScanned(uuid, item, nbFound = 0) {
  // TRICK: only record uuids
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)) {
    return;
  }

  const duplicatedItem = item;

  duplicatedItem.time = new Date();
  duplicatedItem.duplicated = nbFound > 1;

  if (nbFound === 0) {
    duplicatedItem.fixture = '';
    duplicatedItem.uuid = uuid;
    duplicatedItem.status = 'missing';
  }

  allScans.set(uuid, duplicatedItem);
}

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));

app.get(['/favicon.ico', '/robots.txt'], (req, res) => {
  res.sendStatus(204);
});

app.get('/search', (req, res) => {
  loadDatabase((allItems) => {
    console.log(allItems);
    res.render('search', {
      matches: searchDatabase(req.query, allItems).sortByFloor(),
    });
  });
});

app.get('/qrlist', (req, res) => {
  loadDatabase((allItems) => {
    const qrList = searchDatabase(req.query, allItems);
    qrList.filterEmptyUuid();
    qrList.sortByFloor();
    qrList.forEach(item => item.addQrImg());
    res.render('qrList', { matches: qrList });
  });
});

app.get('/recent', (req, res) => {
  res.render('recent', { allScans });
});

app.get('/:uuid', (req, res) => {
  loadDatabase((allItems) => {
    const matches = searchDatabase(req.params, allItems);
    if (matches.length === 0) {
      addRecentlyScanned(req.params.uuid, {});
      res.status(404).render('notFound', {
        item: '',
        id: req.params.uuid,
      });
      return;
    }
    if (matches.length > 1) {
      console.log(`Too much matches for uuid ${req.params.uuid} length = ${matches.length}`);
    }
    addRecentlyScanned(req.params.uuid, matches[0], matches.length);
    matches[0].similarItems = searchDatabase({ fixture: matches[0].fixture }, allItems)
      .filter(item => item.uuid !== matches[0].uuid)
      .splice(0, 3);
    addMarkdown(matches[0]);
    addSimilarItems(matches[0], allItems);
    res.render('item', matches[0]);
  });
});

app.get('/', (req, res) => {
  res.render('home', {});
});

const port = process.env.PORT || 1234;

app.listen(port, () => {
  console.log(`working on ${port}`);
});
