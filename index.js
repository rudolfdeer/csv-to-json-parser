import fs from 'fs';
import { program } from 'commander';
import { pipeline } from 'stream';
import { parse } from'csv-parse';
//import { transformer } from './src/transformer.js';
import { transform } from 'stream-transform';

program
  .option('--sourceFile <file>', 'source file')
  .option('--resultFile <file>', 'result file')
  .option('--separator <separator>', 'optional: separator')
  .parse(process.argv);

const { sourceFile, resultFile, separator } = program.opts();

const parser = parse({
  delimiter: separator,
});

const transformer = transform((record, callback) => {
  setTimeout(() => {
    callback(null, record.join(' ')+'\n');
  }, 500);
}, {
  parallel: 5
});

const inputStream = sourceFile ? fs.createReadStream(sourceFile) : process.stdin;
//const transformStream = transformer(separator);
const outputStream = resultFile ? fs.createWriteStream(resultFile) : process.stdout;



pipeline(inputStream, parser, transformer, outputStream, (err) => {
  if (err) {
    process.stderr.write(`pipeline error: ${err}\n`);
    process.exit(1);
  }
});
