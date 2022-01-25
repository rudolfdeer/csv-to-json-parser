const detectSeparator = (text) => {
  const possibleDelimiters = [',', ';', ' ', '|'];
  return possibleDelimiters.filter(check).join('');

  function check (delimiter) {
      let cache = -1;
      return text.split('\n').every(checkLength);

      function checkLength (line) {
          if (!line) {
              return true;
          }

          const length = line.split(delimiter).length;
          if (cache < 0) {
              cache = length;
          }
          return cache === length && length > 1;
      }
  }
}

export { detectSeparator };