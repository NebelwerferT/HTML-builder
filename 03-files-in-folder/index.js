const { readdir, stat } = require('fs/promises');
const path = require('path');

const printFilesInfo = async (dirPath, fileFullName) => {
    const BYTES_IN_KB = 1024;
    const extName = path.extname(fileFullName);
    const fileName = path.basename(fileFullName, extName);
    const fileWeight = (await stat(path.resolve(dirPath, fileFullName))).size;
    console.log(`${fileName} - ${extName.slice(1)} - ${fileWeight / BYTES_IN_KB}kb`);
}

const getFilesInDir = async (dir) => {
    const dirPath = path.resolve(__dirname, dir);
    const dirEntts = await readdir(dirPath, { withFileTypes: true, });
    const dirFiles = dirEntts.filter(entity => entity.isFile());
    dirFiles.forEach(file => { printFilesInfo(dirPath, file.name); });
}

getFilesInDir('secret-folder');