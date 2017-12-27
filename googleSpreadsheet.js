const google = require('googleapis');
const keys = require('./config/keys');
const marked = require('marked');


let loadedItems = [];

// creates a dictionary mapping column names with the values
// ex: { floor : 402, business : coworking, etc..}
function spreadsheetValuesToObject(values, columns) {
  const formatedRow = {};
  for (let i = 0; i < columns.length; i += 1) {
    formatedRow[columns[i]] = values[i];
  }
  return formatedRow;
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
    const columns = response.values[0];
    loadedItems = response.values.map(row => spreadsheetValuesToObject(row, columns));
    return callback();
  });
}

function searchDatabase(query, callback) {
  if (loadedItems.length === 0) {
    // if the database was not loaded load it then recall this function with the same parameters
    // warning, this causes an infinite loop if the spreadsheet is empty or unreachable
    loadDatabase(() => searchDatabase(query, callback));
    return;
  }
  let queryResult = loadedItems;
  Object.keys(query).map((key) => {
    queryResult = loadedItems.filter(item => item[key] === query[key]);
  });
  return callback(queryResult);
}

function addSimilarItems(items) {
  const obj = items;
  obj.similarItems = loadedItems.filter(item => item.fixture === obj.fixture)
    .filter(item => item.uuid !== obj.uuid)
    .splice(0, 3);
  return obj;
}

function addMarkdown(items) {
  const obj = items;
  obj.HOWTO = marked(obj.HOWTO);
  obj.details = marked(obj.details);
  obj.Troubleshooting = marked(obj.Troubleshooting);
  return obj;
}

module.exports = {
  searchDatabase,
  addMarkdown,
  addSimilarItems,
};
