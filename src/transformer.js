import { Transform } from 'stream';
class Transformer extends Transform {
  constructor(separator, func) {
    super();
    this.separator = separator;
    this.func = func;
    this.arr = [];
    this.rows = [];
    this.headers = [];
  }

  _transform(chunk, encoding, callback) {
    const inputString = chunk.toString();

    this.rows = inputString.split('\n');

    if (!this.separator) {
      this.separator = this.func(inputString);
      console.log('separator detected: ', this.separator);
    }

    this.headers = this.rows[0].split(this.separator);
    this.values = this.rows.map((row) => row.trim().split(this.separator));

    for (let i = 1; i < this.rows.length - 1; i++) {
      const obj = {};

      for (let k = 0; k < this.values[i].length - 1; k++) {
        obj[this.headers[k].trim()] = this.values[i][k].trim();
      }

      this.arr.push(obj);
    }

    this.push(JSON.stringify(this.arr));
    callback();
  }
}

const transformer = (separator, func) => new Transformer(separator, func);

export { transformer };
