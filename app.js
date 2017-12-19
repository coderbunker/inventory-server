const express = require('express');

const qr = require('qr-image');

const { loadDatabase, searchDatabase } = require('./googleSpreadsheet');

const app = express();

const allScans = [];

function logScanned(uuid, allMatches) {
  const now = new Date();
  // TRICK: fixture tells if the the uuid was found in database or not
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)) {
    return;
  }
  allScans.map(item => item.status = (item.uuid === uuid) ? 'fixed' : item.status);
  console.log('allmatch: ', allMatches);
  if (allMatches.length > 1) {
    allMatches.map((item, index) =>
      allScans.unshift({
        time: now,
        fixture: allMatches[index].fixture ? allMatches[index].fixture : '',
        status: allMatches[index].fixture ? '' : 'missing',
        uuid,
        double: true,
      }));
    return;
  }
  allScans.unshift({
    time: now,
    fixture: allMatches[0].fixture ? allMatches[0].fixture : '',
    status: allMatches[0].fixture ? '' : 'missing',
    uuid,
  });
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
    const matches = searchDatabase(req.params, allItems);
    if (matches.length === 0) {
      logScanned(req.params.uuid, [{fixture: null}]);
      res.status(404).render('notFound', {
        item: '',
        id: req.params.uuid,
      });
      return;
    }
    logScanned(req.params.uuid, matches);
    matches[0].similarItems = searchDatabase({ fixture: matches[0].fixture }, allItems)
      .filter(item => item.uuid !== matches[0].uuid)
      .splice(0, 3);
    res.render('item', matches[0]);
  });
});

app.get('/', (req, res) => {
  res.redirect('https://cryptic-woodland-88390.herokuapp.com/');
});

const port = process.env.PORT || 1234;

app.listen(port, () => {
  console.log(`working on ${port}`);
});
