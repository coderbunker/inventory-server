const express = require('express');
// const urlRegex = require('url-regex');
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
  googleSpreadsheet.findEquipment({ uuid: req.params.id }, (matches) => {
    if (!matches) {
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
