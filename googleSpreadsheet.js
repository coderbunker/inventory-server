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
    return callback(response.values);
  });
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

// TODO: SORT BY FLOOR ONLY? WHAT ELSE?
// TODO: NOIMG.PNG DISAPPEARS IF URL HAS ANY CHARACTER AFTER ...SEARCH (ex search/ or search/bed)
// TODO: findAllEquipment IS MESSY NOW REFACTOR,
// TODO: REMOVE SPLICE FROM LAST callback (FIND ANOTHER WAY TO REMOVE FIRST EMPTY OBJ)
function findAllEquipment(id, callback) {
  loadDatabase((rows) => {
    let newId = '';
    if (id !== undefined) {
      for (let i = 0; i < rows.length; i += 1) {
        const objKey = getKeyByValue(rows.map((row) => rowToObject(row, rows[0]))[i], id);
        if (objKey !== undefined) {
          newId = objKey;
        }
      }
      callback(rows.map((row) =>
        rowToObject(row, rows[0])).filter((item) =>
        item[newId] === id).sort((a, b) =>
        a.floor === b.floor ? 0 : +(a.floor > b.floor) || -1));
    } else {
      callback(rows.map((row) =>
        rowToObject(row, rows[0])).splice(1, rows.length).sort((a, b) =>
        a.floor === b.floor ? 0 : +(a.floor > b.floor) || -1));
    }
  });
}

function findEquipment(uuid, callback) {
  loadDatabase((rows) =>
    callback(rows.map((row) =>
      rowToObject(row, rows[0])).filter((item) =>
      item.uuid === uuid)));
}

module.exports = {
  findEquipment,
  findAllEquipment,
};
