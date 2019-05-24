export default {
  getDieType (sides) {
    switch (parseInt(sides)) {
      case 100:
        return 'd100';
      case 20:
        return 'd20';
      case 12:
        return 'd12';
      case 10:
        return 'd10';
      case 8:
        return 'd8';
      case 6:
        return 'd6';
      case 4:
        return 'd4';
      case 2:
        return 'd2';
      default:
        return 'custom';
    }
  },
  rollDie (min, max) {
    return Math.ceil(Math.random() * max - min) + min;
  },
  multiplyVector (a, b) {
    var result;

    if (Array.isArray(a) && typeof b === 'number') {
      result = new Array(a.length);

      for (let i = 0; i < a.length; i++) {
        if (typeof a[i] !== 'number') {
          throw new Error('Input vector A contains a non-number value');
        }

        result[i] = a[i] * b;
      }
    } else if (typeof a === 'number' && Array.isArray(b)) {
      result = new Array(b.length);

      for (let i = 0; i < b.length; i++) {
        if (typeof b[i] !== 'number') {
          throw new Error('Input vector B contains a non-number value');
        }

        result[i] = b[i] * a;
      }
    } else if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        throw new Error('multiplyVector can only be called on vectors of the same size or one vector and one number.');
      } else {
        result = new Array(a.length);

        for (let i = 0; i < a.length; i++) {
          result[i] = a[i] * b[i];
        }
      }
    }

    return result;
  },
  deepEquals (a, b) {
    if (typeof a !== 'object') return false;
    for (let i in a) {
      if (typeof a[i] === 'object' && typeof b[i] === 'object') {
        if (!this.deepEquals(a[i], b[i])) {
          return false;
        }

      } else if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  },
  titlize (str) {
    str = str.split(' ');
    var result = [];

    for (var i = 0; i < str.length; i++) {
      result[i] = str[i].charAt(0).toLocaleUpperCase() + str[i].slice(1);
    }
    return result.join(' ');
  }
}
