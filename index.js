import fs from 'fs';
import { program } from 'commander';
import csv from 'csv-parser';

program
  .option('--sourceFile <file>', 'source file')
  .option('--resultFile <file>', 'result file')
  .option('--separator <separator>', 'optional: separator')
  .parse(process.argv);

const { sourceFile, resultFile, separator } = program.opts();

const obj = [];

fs.createReadStream(sourceFile)
  .pipe(csv())
  .on('error', (err) => {
    process.stderr.write(`error: ${err}\n`);
    process.exit(1);
  })
  .on('data', (chunk) => {
    obj.push(chunk);
  })
  .on('end', () => {
    fs.writeFileSync(resultFile, JSON.stringify(obj), (err) => {
      if (err) throw err;
    });
    process.exit();
  });
