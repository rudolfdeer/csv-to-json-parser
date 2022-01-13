const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { pipeline } = require('stream');
import { parse } from 'csv-parse';
import { transformer } from './src/transformer.js';

program
  .option('--sourceFile <file>', 'source file')
  .option('--resultFile <file>', 'result file')
  .option('--separator <separator>', 'optional: separator')
  .parse(process.argv);

const { sourceFile, resultFile, separator } = program.opts();

const records = [];

const parser = parse({
  delimiter: separator,
});

const inputStream = sourceFile ? fs.createReadStream(sourceFile) : process.stdin;
const transformStream = transformer(separator);
const outputStream = resultFile ? fs.createWriteStream(resultFile) : process.stdout;

pipeline(inputStream, transformStream, outputStream, (err) => {
  if (err) {
    process.stderr.write(`pipeline error: ${err}\n`);
    process.exit(1);
  }
});
