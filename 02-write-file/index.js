const fs = require('fs');
const path = require('path');
const readline = require('readline');
const EOL = require("os").EOL;

const execExit = () => {
    console.log(`${EOL}До свидания!`);
    process.exit(0);
}

const filePath = path.resolve(__dirname, 'text.txt');

fs.open(filePath, 'w', (err) => {
    if (err) throw err;
    console.log('Введите текст (или "exit", чтобы завершить работу): ');
    rl.prompt();
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
});

rl.addListener('line', (data) => {
    if (data.trim() === 'exit') execExit();
    fs.appendFile(filePath, `${data}${EOL}`, (err) => {
        if (err) throw err;
    });
    rl.prompt();
});

rl.addListener('SIGINT', () => {
    console.log('\x1b[31m%s\x1b[0m', 'Ctrl + C');
    execExit();
})