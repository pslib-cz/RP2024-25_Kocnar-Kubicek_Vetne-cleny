const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const version = process.argv[2];

if (!version) {
  throw new Error("Version argument is required, use as follows: npm run formatcsv <version>");
}

const spreadsheets = [
  path.resolve(__dirname, `../data/sheets/${version}/All.csv`),
  path.resolve(__dirname, `../data/sheets/${version}/All.csv`),
  path.resolve(__dirname, `../data/sheets/${version}/Privlastek.csv`),
  //path.resolve(__dirname, `../data/sheets/${version}/Prisl.csv`),
  path.resolve(__dirname, `../data/sheets/${version}/Doplnek.csv`),
];

const outputJsonPath = path.resolve(__dirname, `../data/sheets/${version}/sets.json`);
const typesJsonPath = path.resolve(__dirname, `../data/sheets/${version}/types.json`);

function cleanWord(word) {
  return word.replace(/\.+$/, ''); // Remove trailing dots
}

async function parseCsvToJson(files) {
  const mergedData = [];
  const typesIndex = {};

  for (const file of files) {
    const filePath = path.resolve(__dirname, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let { data } = Papa.parse(fileContent);
    data = data.map(row => {
      if (!Array.isArray(row)) return []; // Skip invalid rows
      return row.reduce((result, value, index) => {
        if (value === '') return result; // Skip empty values
        if (index % 2 === 0) {
          result.push([value]);
        } else if (result.length > 0) {
          result[result.length - 1].push(value);
          // Add word to types index
          const type = value.toLowerCase();
          const word = cleanWord(result[result.length - 1][0]); // Clean the word before storing
          if (!typesIndex[type]) {
            typesIndex[type] = [];
          }
          if (!typesIndex[type].includes(word)) { // Avoid duplicates
            typesIndex[type].push(word);
          }
        }
        return result;
      }, []);
    }).filter(row => row.length > 0).sort((a, b) => getRowDifficulty(a) - getRowDifficulty(b)); // Remove empty rows
    mergedData.push(data);
  }

  // Write sets JSON
  fs.writeFileSync(outputJsonPath, JSON.stringify(mergedData));
  console.log(`Merged JSON written to ${outputJsonPath}`);

  // Write types JSON
  fs.writeFileSync(typesJsonPath, JSON.stringify(typesIndex));
  console.log(`Types JSON written to ${typesJsonPath}`);
}

function getRowDifficulty(row) {

  const types = row.map((word) => word[1].toLowerCase());
  
  const weights = {
    "po": 0,
    "př": 1,
    "pt": 2.5,
    "pks": 2,
    "pkn": 2.5,
    "d": 3,
    "default": 2
  };

  const sum = types.reduce((acc, type) => acc + (weights[type] || weights["default"]), 0);

  const difficulty = sum / Math.log2(types.length);

  return difficulty;
}

parseCsvToJson(spreadsheets).catch((err) => {
  console.error("Error parsing CSV files:", err);
});



