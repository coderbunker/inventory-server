const spreadsheet = require('../googleSpreadsheet');

function sum(a, b) {
  return a + b;
}
test('test rowToObject', () => {
  expect(sum(1, 2)).toBe(3);
});
