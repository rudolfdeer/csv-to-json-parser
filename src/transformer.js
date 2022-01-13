import { Transform } from 'stream';

class Transformer extends Transform {
  constructor(separator) {
    super();
    this.separator = separator;
  }

  _transform(chunk, encoding, callback) {
    callback();
  }
}

const transformer = (separator) =>
  new Transformer(separator);

export { transformer };
