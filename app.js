var express = require('express');
var Session = require('express-session');
var google = require('googleapis');
const uuid = require('uuid-regexp');
const urlRegex = require('url-regex');

const keys = require('./config/keys');

var app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));


app.get('/favicon.ico', function(req, res) {
    res.status(204);
});


let id = [];

app.get("/:id", function(req, res) {

    //SPREADSHEET
    var sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
      auth: keys.apiKey,
      spreadsheetId: '1QHKa3vUpht7zRl_LEzl3BlUbolz3ZiL8yKHzdBL42dY',
      range: 'Agora inventory!A:Z'
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var rows = response.values;
      var result = [];
      if (rows.length == 0) {
        console.log('No data found.');
      } else {
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          if (row[11]) {
            result.push(row);

          }
        }
        let matchedItem = result.find(function(item) {
          if (uuid().test(item)) {
            return uuid().exec(item)[0] === req.params.id;
          }
        });
        let list = '';

        if (matchedItem) {
          for (var i = 0; i < 12; i++) {
            if (matchedItem[i].length > 1) {
              let text = matchedItem[i];
              let newUrl;
              if (urlRegex().test(text)) {
                newUrl = text.match(urlRegex());
                newUrl.forEach((url) => {
                  text = text.replace(url, `<a href="${url}">${url}</a>`)
                });
              }
              list += `<li>${result[0][i].toUpperCase()}: <span class="detail">${text}</span></li>`
            }

          }
          res.render('item', {item: list});
        } else {
          res.render('notFound', {item: list, id: req.params.id});
        }
      }
    });
});

app.get('/', (req, res) => {
  res.send('Hello;)');
});


const port = process.env.PORT || 1234;



app.listen(port, () => {
  console.log(`working on ${port}`);
});
