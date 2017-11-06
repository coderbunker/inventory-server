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
      rowToObject(row, response.values[0])).splice(1, response.values.length));
  });
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

// TODO: NOIMG.PNG DISAPPEARS IF URL HAS ANY CHARACTER AFTER ...SEARCH (ex search/ or search/bed)
function findAllEquipment(column, value, callback) {
  loadDatabase((rows) => {
    if (value === undefined) {
      return callback(rows);
    }
    return callback(rows.filter((item) =>item[column] === value));
  });
}

function findEquipment(uuid, callback) {
  loadDatabase((rows) =>
    callback(rows.filter((item) => item.uuid === uuid)));
}

module.exports = {
  findEquipment,
  findAllEquipment,
};
