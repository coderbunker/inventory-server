const google = require('googleapis');
const keys = require('./config/keys');
const marked = require('marked');

function rowToObject(val, lab) {
  const o = {};
  for (let i = 0; i < lab.length; i += 1) {
    o[lab[i]] = val[i];
  }
  return o;
}

function loadDatabase(callback) {
  const sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: keys.apiKey,
    spreadsheetId: '1QHKa3vUpht7zRl_LEzl3BlUbolz3ZiL8yKHzdBL42dY',
    range: 'Agora inventory!A:Z',
  }, (err, response) => {
    if (err) {
      console.log(`The API returned an error: ${err}`);
      return;
    }
    return callback(response.values.map(row =>
      rowToObject(row, response.values[0])).splice(1));
  });
}

function searchDatabase(query, rows) {
  let matches = rows;
  Object.keys(query).map((key) => {
    matches = matches.filter(item => item[key] === query[key]);
  });
  return matches;
}

function addSimilarItems(obj, allObj) {
  obj.similarItems = searchDatabase({ fixture: obj.fixture }, allObj)
    .filter(item => item.uuid !== obj.uuid)
    .splice(0, 3);
  return obj;
}

function addMarkdown(obj) {
  obj.HOWTO = marked(obj.HOWTO);
  obj.details = marked(obj.details);
  obj.Troubleshooting = marked(obj.Troubleshooting);
  return obj;
}

module.exports = {
  loadDatabase,
  searchDatabase,
  addMarkdown,
  addSimilarItems,
};
