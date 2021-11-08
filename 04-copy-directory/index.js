const { readdir, mkdir, rm, copyFile } = require('fs/promises');
const path = require('path');

const reDir = async (distPath) => {
    await rm(distPath, { force: true, recursive: true });
};

const getFilesInDir = async (srcPath, distPath) => {
    await mkdir(distPath, { recursive: true });
    const dirEntts = await readdir(srcPath, { withFileTypes: true, });
    dirEntts.forEach(entity => {
        if (entity.isFile()) {
            const fileFrom = path.resolve(srcPath, entity.name);
            const fileTo = path.resolve(distPath, entity.name);
            copyFile(fileFrom, fileTo, null, (err) => {
                if (err) throw err;
            });
        } else if (entity.isDirectory()) {
            const nextSrcPath = path.resolve(srcPath, entity.name);
            const nextDistPath = path.resolve(distPath, entity.name);
            getFilesInDir(nextSrcPath, nextDistPath);
        }
    });
};

const copyDir = async (src, dist) => {
    const srcPath = path.resolve(__dirname, src);
    const distPath = path.resolve(__dirname, dist);
    await reDir(distPath);
    await getFilesInDir(srcPath, distPath);
};

copyDir('files', 'file-copy');