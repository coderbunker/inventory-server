const google = require('googleapis');
const keys = require('./config/keys');

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
    return callback(response.values.map((row) =>
      rowToObject(row, response.values[0])).splice(1));
  });
}

function findEquipment(query, callback) {
  loadDatabase((rows) => {
    for (const key of Object.keys(query)) {
      rows = rows.filter((item) => item[key] === query[key]);
    }
    return callback(rows);
  });
}

module.exports = {
  findEquipment,
};
