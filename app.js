const express = require('express');
// const urlRegex = require('url-regex');
const googleSpreadsheet = require('./googleSpreadsheet');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));

app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

app.get(['/search/', '/search/:id'], (req, res) => {
  googleSpreadsheet.findAllEquipment(req.params.id, (matches) => {
    res.render('search', {
      matches: matches,
    });
  });
});

app.get('/:id', (req, res) => {
  googleSpreadsheet.findEquipment(req.params.id, (matchedItem) => {
    // console.log('using findEquipment callback, ', req.params.id);
    if (!matchedItem) {
      res.render('notFound', {
        item: '',
        id: req.params.id,
      });
      return;
    }
    //  console.log(matchedItem);
    res.render('item', matchedItem[0]);
  });
});

app.get('/', (req, res) => {
  res.redirect('https://cryptic-woodland-88390.herokuapp.com/');
});

const port = process.env.PORT || 1234;

app.listen(port, () => {
  console.log(`working on ${port}`);
});
