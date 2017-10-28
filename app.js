const express = require('express');
// const urlRegex = require('url-regex');
const googleSpreadsheet = require('./googleSpreadsheet');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));

app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

// function makeClickable(text) {
//   const newUrl = text.match(urlRegex());
//   if (!newUrl) {
//     return text;
//   }
//
//   let newText = text;
//   newUrl.forEach((url) => {
//     newText = text.replace(url, `<a href="${url}">${url}</a>`);
//   });
//   return newText;
// }

const testEquipmentList = [
  {
    fixture: "printer",
    model: "XJ220",
    status: "broken",
    picture: "https://static1.squarespace.com/static/54e8ba93e4b07c3f655b452e/t/56c2a04520c64707756f4267/1493764650017/",
    floor: "Bunker",
    room: "classroom",
    location: "in front of you",
  },
  {
      fixture: "monitor",
      model: "3D",
      status: "working",
      floor: "Bunker",
      room: "classroom",
      location: "right behind you",
    }
  ];

app.get('/search', (req, res) => {
  res.render('search', {matches:testEquipmentList});
});

app.get('/:id', (req, res) => {
  googleSpreadsheet.findEquipment(req.params.id, (matchedItem) => {
    if (!matchedItem) {
      res.render('notFound', {
        item: '',
        id: req.params.id,
      });
      return;
    }
    console.log(matchedItem);
    res.render('item', matchedItem);
  });
});

app.get('/', (req, res) => {
  res.redirect('https://cryptic-woodland-88390.herokuapp.com/');
});

const port = process.env.PORT || 1234;

app.listen(port, () => {
  console.log(`working on ${port}`);
});
