const express = require('express');

const { Spreadsheet } = require('./googleSpreadsheet');

var spreadsheet = new Spreadsheet();

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));

app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

app.get('/search', (req, res) => {
  spreadsheet.loadDatabase((allItems) => {
    res.render('search', {
      matches: spreadsheet.searchDatabase(req.query, allItems)
        .sort((a, b) => (a.floor === b.floor ? 0 : +(a.floor > b.floor) || -1)),
    });
  });
});

app.get('/admin', (req,res) => {
  var lastId = spreadsheet.lastId;
  res.render('admin', { lastId });
});

app.get('/:uuid', (req, res) => {
  spreadsheet.loadDatabase((allItems) => {
    const matches = spreadsheet.searchDatabase(req.params, allItems);
    if (matches.length === 0) {
      spreadsheet.lastId = req.params.uuid;
      res.render('notFound', {
        item: '',
        id: req.params.id,
      });
      return;
    }
    matches.similarItems = spreadsheet.searchDatabase({ fixture: matches[0].fixture }, allItems)
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
