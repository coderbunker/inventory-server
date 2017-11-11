const express = require('express');

const googleSpreadsheet = require('./googleSpreadsheet');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));

app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

app.get('/search', (req, res) => {
  googleSpreadsheet.findEquipment(req.query, (allItems) => {
    let matches = allItems;
    Object.keys(req.query).map((key) => {
      matches = matches.filter(item => item[key] === req.query[key]);
    });
    res.render('search', {
      matches: matches.sort((a, b) => (a.floor === b.floor ? 0 : +(a.floor > b.floor) || -1)),
    });
  });
});

app.get('/:id', (req, res) => {
  googleSpreadsheet.findEquipment(req.query, (allItems) => {
    const matches = allItems.filter(item => item.uuid === req.params.id);
    if (matches.length === 0) {
      res.render('notFound', {
        item: '',
        id: req.params.id,
      });
      return;
    }
    matches.similarItems = allItems
      .filter(item =>
        item.fixture === matches[0].fixture && item.uuid !== matches[0].uuid)
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
