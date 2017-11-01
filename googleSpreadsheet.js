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

function findAllEquipment(callback) {
    loadDatabase((rows) => {
        return callback(rows.map((row) => {
            return rowToObject(row, rows[0]);
        }));
    });
}
// .splice(1, rows.length));
// ^^^ FIRST ELEMENT IS USELESS DATA, SPLICED IT OFF
// CANT BE USED IF I WANT TO NEST findAllEquipment INTO findEquipment

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
