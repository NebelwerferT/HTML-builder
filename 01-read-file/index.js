const fs = require('fs');
const path = require('path');

let readStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'));

readStream.addListener('data', (data) => { console.log(data.toString()); });