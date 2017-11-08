const express = require('express');

const googleSpreadsheet = require('./googleSpreadsheet');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));

app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

app.get('/search', (req, res) => {
  googleSpreadsheet.findEquipment(req.query, (matches) => {
    res.render('search', {
      matches: matches.sort((a, b) =>
        a.floor === b.floor ? 0 : +(a.floor > b.floor) || -1),
    });
  });
});

app.get('/:id', (req, res) => {
  googleSpreadsheet.findEquipment(req.query, (allItems) => {
    const matches = allItems.filter((item) =>  item.uuid === req.params.id);
    matches.similarItems = allItems.filter((item) =>  matches[0].fixture === item.fixture);
    for (let i = 0; i < matches.similarItems.length; i += 1) {
      console.log('similarItems ', matches.similarItems[i]);
    }
    if (!allItems) {
      res.render('notFound', {
        item: '',
        id: req.params.id,
      });
      return;
    }
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
