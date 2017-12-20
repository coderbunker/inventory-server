const google = require('googleapis');
const keys = require('./config/keys');

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
    // map function transforms a list into another list using the given lambda function
    const formatedRows = response.values.map(row => spreadsheetValuesToObject(row, columns));
    return callback(formatedRows);
  });
}

function searchDatabase(query, rows) {
  let matches = rows;
  Object.keys(query).map((key) => {
    matches = matches.filter(item => item[key] === query[key]);
  });
  return matches;
}

module.exports = {
  loadDatabase,
  searchDatabase,
};
