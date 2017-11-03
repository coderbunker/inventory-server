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

// TODO: REFACTOR: RUN CALLBACK > ROWSTOOBECT >
// LOOP THROUGH OBJECTS AND GATHER CATEGORIES (IE FLOOR, BUSINESS, ETC)
function findAllEquipment(id, callback) {
  loadDatabase((rows) => {
    let newId = '';
    switch (id) {
      case '101':
      case '402':
      case '503':
      case '701':
      case 'bunker':
        newId = 'floor';
        break;
      case 'coliving':
      case 'coworking':
        newId = 'business';
        break;
      case 'big bedroom':
      case 'classroom':
      case 'corridor':
      case 'entrance':
      case 'kitchen':
      case 'meeting room':
      case 'open room':
      case 'open space':
      case 'painting gallery':
      case 'piano room':
      case 'private office':
      case 'private office 4':
      case 'private office 6':
      case 'private office 6p':
      case 'serve room':
        newId = 'room';
        break;
      case 'Agora desk':
      case 'bed':
      case 'coffee table':
      case 'fridge':
      case 'Laptop':
      case 'light':
      case 'light cover':
      case 'mobile whiteboard':
      case 'monitor':
      case 'office chairs':
      case 'oven':
      case 'paper shredder':
      case 'printer':
      case 'round light':
      case 'sofa':
      case 'table':
      case 'TV':
      case 'video projector':
        newId = 'fixture';
        break;
      case 'computer':
      case 'furniture':
      case 'office appliance':
        newId = 'category';
        break;
      case '_':
      case '?':
      case 'back':
      case 'bar':
      case 'between 2 sofas':
      case 'door':
      case 'kitchenette':
      case 'left':
      case 'minibar':
      case 'next to cupboard':
      case 'next to door':
      case 'next to office manager':
      case 'right':
      case 'under stand up desk':
      case 'wooden cabinet':
        newId = 'location';
        break;
      default:
        callback(rows.map((row) =>
          rowToObject(row, rows[0])).splice(1, rows.length).sort((a, b) =>
          a.floor === b.floor ? 0 : +(a.floor > b.floor) || -1));
    }
    callback(rows.map((row) =>
      rowToObject(row, rows[0])).filter((item) =>
      item[newId] === id).sort((a, b) =>
      a.floor === b.floor ? 0 : +(a.floor > b.floor) || -1));
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
