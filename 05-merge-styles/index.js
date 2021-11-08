const { readdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, 'styles');
const distFile = path.resolve(__dirname, 'project-dist', 'bundle.css');
const tgtExt = '.css';

let wStream = fs.createWriteStream(distFile);

let stylesArr = [];

const getCssFiles = async () => {
    let files = await readdir(srcDir, { withFileTypes: true, });
    files = files.filter(file => (file.isFile() && path.extname(file.name) === tgtExt)).map(file => file.name);
    return files;
}

const readStyles = async (cssFile) => {
    let styles = '';
    return new Promise((res, rej) => {
        let rStream = fs.createReadStream(path.resolve(srcDir, cssFile));
        rStream.addListener('data', (data) => { styles += data });
        rStream.addListener('end', (err) => {
            res(styles);
        });
    });
}

const writeStyles = async () => {
    stylesArr.forEach(async cs => await cs.then((data) => {
        wStream.write(data);
    }));
}

const createCssBundle = async () => {
    const cssFiles = await getCssFiles();
    cssFiles.forEach(cssFile => { stylesArr.push(readStyles(cssFile)); });
    writeStyles()
}

createCssBundle();