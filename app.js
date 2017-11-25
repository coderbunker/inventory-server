const express = require('express');

const qr = require('qr-image');

const { loadDatabase, searchDatabase } = require('./googleSpreadsheet');

const app = express();

const recentScans = {
  assigned: [],
  unassigned: [],
};

const date = new Date();
const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
const hour = date.getHours();
const dayOfWeek = date.getDay();
const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const scanTime = week[dayOfWeek] + ' ' + hour + ':' + minutes;

function logScanned(uuid, fixture) {
  // TRICK: fixture tells if the the uuid was found in database or not

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)) {
    return;
  }

  if (!fixture) {
    recentScans.unassigned.push({ time: scanTime, status: 'missing', uuid });
    return;
  }
  recentScans.unassigned.map(item => item.status = (item.uuid === uuid) ? 'fixed' : item.status);

  recentScans.assigned.push({ time: scanTime, fixture, uuid });
}


app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));

app.get('/favicon.ico', (req, res) => {
  res.status(204);
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
  res.render('recent', { data: recentScans });
});

app.get('/:uuid', (req, res) => {
  loadDatabase((allItems) => {
    const matches = searchDatabase(req.params, allItems);
    if (matches.length === 0) {
      logScanned(req.params.uuid);
      res.render('notFound', {
        item: '',
        id: req.params.uuid,
      });
      return;
    }
    logScanned(req.params.uuid, matches[0].fixture);
    matches.similarItems = searchDatabase({ fixture: matches[0].fixture }, allItems)
      .filter(item => item.uuid !== matches[0].uuid)
      .splice(0, 3);
    res.render('item', { matches });
  });
});

app.get('/', (req, res) => {
  res.redirect('https://cryptic-woodland-88390.herokuapp.com/');
});

const port = process.env.PORT || 1234;

app.listen(port, () => {
  console.log(`working on ${port}`);
});
