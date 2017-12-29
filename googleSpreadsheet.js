const google = require('googleapis');
const keys = require('./config/keys');
const marked = require('marked');
const qr = require('qr-image');

const spreadsheetDataId = '1QHKa3vUpht7zRl_LEzl3BlUbolz3ZiL8yKHzdBL42dY';
const spreadsheetLink = `https://docs.google.com/spreadsheets/d/${spreadsheetDataId}/edit`;

// creates a dictionary mapping column names with the values
// ex: { floor : 402, business : coworking, etc..}
function spreadsheetValuesToObject(values, columns, index) {
  const formatedRow = {};
  for (let i = 0; i < columns.length; i += 1) {
    formatedRow[columns[i]] = values[i];
  }
  formatedRow.addQrImg = function addQrImg() {
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(this.uuid)) {
      this.qr = qr.imageSync(this.uuid, { type: 'svg' });
    }
  };
  formatedRow.cellRef = `${spreadsheetLink}#gid=0&range=A${index}:T${index}`;
  return formatedRow;
}

function loadDatabase(callback) {
  const sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: keys.apiKey,
    spreadsheetId: spreadsheetDataId,
    range: 'Agora inventory!A:Z',
  }, (err, response) => {
    if (err) {
      console.log(`The API returned an error: ${err}`);
      return;
    }
    const columns = response.values[0];
    // map function transforms a list into another list using the given lambda function
    let i = 0;
    const formatedRows = response.values.map((row) => {
      i += 1;
      return spreadsheetValuesToObject(row, columns, i);
    });
    return callback(formatedRows);
  });
}

function searchDatabase(query, rows) {
  let matches = rows;
  Object.keys(query).map((key) => {
    matches = matches.filter(item => item[key] === query[key]);
  });
  matches.filterEmptyUuid = function filterEmptyUuid() {
    return this.filter(item => item.uuid !== '').filter(item => item.uuid !== undefined);
  };
  matches.sortByFloor = function sortByFloor() {
    return this.sort((a, b) => (a.floor === b.floor ? 0 : +(a.floor > b.floor) || -1));
  };
  return matches;
}

function addSimilarItems(refItem, allObj) {
  const obj = refItem;
  obj.similarItems = searchDatabase({ fixture: obj.fixture }, allObj)
    .filter(item => item.uuid !== obj.uuid)
    .splice(0, 3);
  return obj;
}

function addMarkdown(refItem) {
  const obj = refItem;
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
