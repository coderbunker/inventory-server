const google = require('googleapis');
const keys = require('./config/keys');


function Spreadsheet() {
  

  this.lastId = '';


  this.rowToObject = function (val, lab) {
    const o = {};
    for (let i = 0; i < lab.length; i += 1) {
      o[lab[i]] = val[i];
    }
    return o;
  }

  this.loadDatabase = function(callback){
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
        this.rowToObject(row, response.values[0])).splice(1));
    });
  }

  this.searchDatabase = function(query, rows){
    let matches = rows;
    Object.keys(query).map((key) => {
      matches = matches.filter(item => item[key] === query[key]);
    });
    return matches;
  }

}

module.exports = {
  Spreadsheet,
};
