const { readdir, mkdir, rm, copyFile } = require('fs/promises');
const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, 'styles');
const distPath = path.resolve(__dirname, 'project-dist');
const distFile = path.resolve(distPath, 'style.css');
const tgtExt = '.css';

let wStream;

let stylesArr = [];

const reDir = async () => {
    await rm(distPath, { force: true, recursive: true });
    await mkdir(distPath, { recursive: true });
    wStream = fs.createWriteStream(distFile);
}

const getCssFiles = async () => {
    let files = await readdir(srcDir);
    files = files.filter(file => (path.extname(file) === tgtExt));
    return files;
}

const readStyles = async (cssFile) => {
    let styles = '';
    return new Promise((res, rej) => {
        let rStream = fs.createReadStream(path.resolve(srcDir, cssFile));
        rStream.addListener('data', (data) => { styles += data });
        rStream.addListener('end', (err) => {
            if (err) throw err;
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
    writeStyles();
}

const getFilesInDir = async (srcPath, distAssetsPath) => {
    await mkdir(distAssetsPath, { recursive: true });
    const dirEntts = await readdir(srcPath, { withFileTypes: true, });
    dirEntts.forEach(entity => {
        if (entity.isFile()) {
            const fileFrom = path.resolve(srcPath, entity.name);
            const fileTo = path.resolve(distAssetsPath, entity.name);;
            copyFile(fileFrom, fileTo, null, (err) => {
                if (err) throw err;
            });
        }
        else if (entity.isDirectory) {
            const nextSrcPath = path.resolve(srcPath, entity.name);
            const nextDistAssetsPath = path.resolve(distAssetsPath, entity.name);
            getFilesInDir(nextSrcPath, nextDistAssetsPath);
        }
    });
};

const readTemplate = async () => {
    let template = '';
    const templatePath = path.resolve(__dirname, 'template.html');
    const rStream = fs.createReadStream(templatePath);
    return new Promise((res, rej) => {
        rStream.addListener('data', data => {
            template += data;
        })
        rStream.addListener('end', () => {
            res(template);
        });
    });
}

const getTemplates = (template) => {
    return template.match(/\{\{.+\}\}/g);
}

const getComponentsName = async () => {
    const componentsDir = path.resolve(__dirname, 'components');
    const componentsName = (await readdir(componentsDir, { withFileTypes: true, }))
        .filter(file => (file.isFile() && path.extname(file.name) === '.html'))
        .map(file => path.basename(file.name, '.html'));
    return componentsName;
}

const replaceTemplateHTML = async (template, matching) => {
    return Promise.all(matching.map(match => new Promise((res, rej) => {
        let componentHTML = '';
        const componentPath = path.resolve(__dirname, 'components', `${match}.html`);
        const reg = new RegExp(`\{\{${match}\}\}`);
        const rStream = fs.createReadStream(componentPath);
        rStream.addListener('data', data => { componentHTML += data; });
        rStream.addListener('end', () => {
            template = template.replace(reg, componentHTML);
            res();
        });
    }))).then(() => template);
}

const createHTML = async () => {
    const htmlPath = path.resolve(distPath, 'index.html');
    const wStream = fs.createWriteStream(htmlPath);
    const components = await getComponentsName();
    const template = await readTemplate();
    const templates = getTemplates(template);
    const matching = components.filter(component => templates.includes(`{{${component}}}`));
    const completedHTML = await replaceTemplateHTML(template, matching);
    wStream.write(completedHTML);
}


const init = async () => {
    await reDir();
    await createCssBundle();
    await getFilesInDir(path.resolve(__dirname, 'assets'), path.resolve(distPath, 'assets'));
    await createHTML();
}

init();