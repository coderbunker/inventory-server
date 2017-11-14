const express = require('express');

const { loadDatabase, searchDatabase } = require('./googleSpreadsheet');

const app = express();

let recentScans = {
  assigned:[],
  unassigned: [],
};

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

app.get('/recent', (req, res) => {
  res.render('recent', {data: recentScans} );
});

app.get('/:uuid', (req, res) => {
  loadDatabase((allItems) => {
    const matches = searchDatabase(req.params, allItems);
    if (matches.length === 0) {
      recentScans.unassigned.push(req.params.uuid);
      res.render('notFound', {
        item: '',
        id: req.params.uuid,
      });
      return;
    }
    recentScans.assigned.push([matches[0].fixture, req.params.uuid]);
    // console.log(recentScans);
    matches.similarItems = searchDatabase({ fixture: matches[0].fixture }, allItems)
      .filter(item => item.uuid !== matches[0].uuid)
      .splice(0, 3);
    res.render('item', { matches });
  });
});

app.get('/', (req, res) => {
  // console.log(req.params);
  res.redirect('https://cryptic-woodland-88390.herokuapp.com/');
});

const port = process.env.PORT || 1234;

app.listen(port, () => {
  console.log(`working on ${port}`);
});
