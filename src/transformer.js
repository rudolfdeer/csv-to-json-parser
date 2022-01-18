import { Transform } from 'stream';
import { parse } from'csv-parse';
// import { transform } from 'stream-transform';

class Transformer extends Transform {
  constructor(separator) {
    super();
    this.separator = separator;
    // this.parser = parse({
    //   delimiter: this.separator,
    // })
  }

  _transform(chunk, encoding, callback) {
    //const inputString = chunk.toString();
    // const outputString = inputString.split('\n');
    const outputString = transform((record, cb) => {
      setTimeout(() => {
        callback(null, record.join(' ')+'\n');
      }, 500);
    }, {
      parallel: 5
    });
    this.push(outputString);
    callback();
  }
}

const transformer = (separator) =>
  new Transformer(separator);



// const transformer = transform((record, cb) => {
//   cb(null, record.join(' ') + '\n');
// }, {
//   parallel: 5,
// } )

export { transformer };