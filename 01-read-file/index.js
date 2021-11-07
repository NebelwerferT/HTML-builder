const fs = require('fs');
const path = require('path');

let readStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), { encoding: 'utf-8', });

readStream.addListener('data', (data) => { process.stdout.write(data); });