const google = require('googleapis');
const keys = require('./config/keys');

function rowToObject(val, lab) {
  const o = {};
  for (let i = 0; i < lab.length; i += 1) {
    o[lab[i]] = val[i];
  }
  return o;
}
//
// function findColumn(rows, label, value) {
//     if (rows.length === 0) {
//         console.log('No data found.');
//         return;
//     }
//
//     for (let i = 0; i < rows.length; i += 1) {
//         if (rows[i][rows[0].indexOf(label)] === value) {
//             return rowToObject(rows[i], rows[0]);
//         }
//     }
// }

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

function findAllEquipment(callback) {
  loadDatabase((rows) => {
    return callback(rows.map((row) => {
      return rowToObject(row, rows[0]);
    }));
  });
}

function findEquipment(uuid, callback) {
// console.log("arf: ", response.values);
// loadDatabase((rows) => {
//  return callback([findColumn(rows, 'uuid', uuid)]);
// });
// OLD ^

  loadDatabase((rows) => {
    return callback(rows.map((row) => {
      return rowToObject(row, rows[0]);
    }).filter((item) => {
      return item.uuid === uuid;
    }));
  });
}

module.exports = {
  findEquipment,
  findAllEquipment,
};
