

const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

module.exports = {

  encode: integer => {
    if (integer === 0) {
      return 0;
    }
    let s = [];
    while (integer > 0) {
      s = [charset[integer % 62], ...s];
      integer = Math.floor(integer / 62);
    }
    return s.join('');
  },

  decode: chars => chars.split('').reverse().reduce((prev, curr, i) =>
    prev + (charset.indexOf(curr) * (62 ** i)), 0)
  
};
