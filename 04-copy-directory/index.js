const { readdir, mkdir, rmdir, copyFile } = require('fs/promises');
const path = require('path');

const srcPath = path.resolve(__dirname, 'files');
const distPath = path.resolve(__dirname, 'file-copy');

const reDir = async () => {
    await rmdir(distPath, { recursive: true });
    await mkdir(distPath, { recursive: true });
}

const getFilesInDir = async () => {
    const dirEntts = await readdir(srcPath, { withFileTypes: true, });
    const dirFiles = dirEntts.filter(entity => entity.isFile());
    dirFiles.forEach(file => { copyFiles(file.name); });
}

const copyFiles = async (fileFullName) => {
    const fileFrom = path.resolve(srcPath, fileFullName);
    const fileTo = path.resolve(distPath, fileFullName);;
    await copyFile(fileFrom, fileTo, null, (err) => {
        if (err) throw err;
    });
}

const init = async () => {
    await reDir();
    await getFilesInDir();
}

init();