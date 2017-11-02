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

function findAllEquipment(id, callback) {
  loadDatabase((rows) => {
    let newId = "";
    if(id === ""){
      return callback(rows.map((row) => {
        return rowToObject(row, rows[0]);
      }));
    }else{
      switch(id){
        case "101":
        case "402":
        case "503":
        case "701":
        case "bunker":
          newId = "floor";
          break;
        case "coliving":
        case "coworking":
          newId = "business";
          break;
        case "classroom":
        case "kitchen":
        case "meeting%20room":
        case "open%20room":
        case "painting%20gallery":
          newId = "room";
          break;
        case "Agora desk":
        case "bed":
        case "coffee table":
        case "fridge":
        case "Laptop":
        case "light":
        case "ligt cover":
        case "mobile whiteboard":
        case "monitor":
        case "office chairs":
        case "oven":
        case "paper shredder":
        case "printer":
        case "round light":
        case "sofa":
        case "table":
        case "TV":
        case "video projector":
          newId = "fixture";
          break;
        case "computer":
        case "furniture":
        case "office appliance":
          newId = "category";
          break;
        default:
          return callback(rows.map((row) => {
            return rowToObject(row, rows[0]);
          }));
      }
      return callback(rows.map((row) => {
        return rowToObject(row, rows[0]);
      }).filter((item) => {
        return item[newId]  === id;
         }));
  }
    // OLD
    // if(id===""){
    //   return callback(rows.map((row) => {
    //     return rowToObject(row, rows[0]);
    //   }));
  // }else{
  //   return callback(rows.map((row) => {
  //     return rowToObject(row, rows[0]);
// }).filter((item) => {
  //   return item.floor === id;
  //   }));
// }
// OLDER
    //   return callback(rows.map((row) => {
    //     return rowToObject(row, rows[0]);
    //   }));
  });
}

function findEquipment(uuid, callback) {
  loadDatabase((rows) => {
    return callback(rows.map((row) => {
      return rowToObject(row, rows[0]);
    }).filter((item) => {
      return item.uuid === uuid;
    }));
  });
  // DONT KNOW HOW TO NEST findAllEquipment IN HERE
}

module.exports = {
  findEquipment,
  findAllEquipment,
};
