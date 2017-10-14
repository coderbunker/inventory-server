const express = require('express');
const urlRegex = require('url-regex');
const googleSpreadsheet = require('./googleSpreadsheet');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));

app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

function makeClickable(text) {
  const newUrl = text.match(urlRegex());
  if (!newUrl) {
    return text;
  }

  let newText = text;
  newUrl.forEach((url) => {
    newText = text.replace(url, `<a href="${url}">${url}</a>`);
  });
  return newText;
}


function renderTemplate(o) {
  let listItem = '';
  for (const k in o) {
    if (o[k]) {
      listItem += `<li>${k.toUpperCase()}: <span class="detail">${makeClickable(o[k])}</span></li>`;
    }
  }
  return listItem;
}


app.get('/:id', (req, res) => {
  googleSpreadsheet.findEquipment(req.params.id, (matchedItem) => {
    if (!matchedItem) {
      res.render('notFound', {
        ite1m: '',
        id: req.params.id,
      });
      return;
    }
    res.render('item', { item: renderTemplate(matchedItem) });
  });
});

app.get('/', (req, res) => {
  res.redirect('https://cryptic-woodland-88390.herokuapp.com/');
});

const port = process.env.PORT || 1234;

app.listen(port, () => {
  console.log(`working on ${port}`);
});
