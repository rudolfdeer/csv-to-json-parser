import { Transform } from 'stream';

class Transformer extends Transform {
  constructor(separator) {
    super();
    this.separator = separator;
    this.arr = [];
  }

  _transform(chunk, encoding, callback) {
    const inputString = chunk.toString();
    
    const headers = inputString.trim().split(this.separator); //get headers here
    const values = inputString.trim().split(this.separator);
    const obj = {};
    
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = values[i].trim();
    }
    this.arr.push(obj);
    this.push(JSON.stringify(this.arr));
    callback();
  }
}

const transformer = (separator) => new Transformer(separator);

export { transformer };
