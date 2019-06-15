import { isCookieEnabled, getCookie, setCookie, removeCookie } from 'tiny-cookie';
import settings from '@/services/settings.js';
import { rollAchievements } from '@/services/cheevos.js';

export default {

  // Give it your number of sides and it will return what type of die it is. Self expanatory except for the default
  // option at the bottom. This is used for setting CSS classes that determine which dice picture and shape to use
  // so giving it a 37 for example needs to be able to return "custom" not just "d37" which doesnt exist. Similarly,
  // if your custom dice happen to have 20 sides, this DOES return "d20" and your dice end up an appropriate shape <3
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

  // What it sounds like. Just returns a random whole number between 1 and sides
  rollDie (sides) {
    return Math.ceil(Math.random() * sides);
  },

  // Javascript doesn't do vector math so we gotta do it ourself.
  // Can be used to multiply two vectors of the same size OR one vector and one number.
  // So like multiplyVector( [1, 2], [3, 4] ) = [3, 8] and multiplyVector( [1, 2, 3], 4 ) = [4, 8, 12] but
  // multiplyVector( [1, 2], [3, 4, 5] ) just errors out. Something else has gone wrong if it's being called like that.
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

    } else if (typeof a === 'number' && typeof b === 'number') {
      // Don't know why you're calling multiplyVector with just two numbers but okay. Nothing TECHNICALLY wrong with that.
      return a * b;

    } else {
      throw new Error('You can\'t call multiplyVector with a ' + typeof a + ' or a ' + typeof b + '. You just can\'t.' );
    }

    return result;
  },

  // This one is cool. This is used for throwing dice in random directions. You set the velocity vector by setting it to
  // something like [0, 40], then specify the angle to rotate that to. It preserves that magnitude and just changes it from
  // straight up to anything else. Thanks, StackOverflow!
  rotateVector2 (vector2, angle) {
    let s = Math.sin(angle);
    let c = Math.cos(angle);

    let xNew = vector2[0] * c - vector2[1] * s;
    let yNew = vector2[0] * s + vector2[1] * c;

    return [xNew, yNew];
  },

  // Compares two objects or arrays, tells you if their values and structure are equal.
  // Necessary because 1 = 1 but [1] != [1]. That's just the way JavaScript compares objects. You gotta do this yourself.
  // Not perfect but I can change it if it ends up needing to do more. This fits my needs.
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

  // Just returns a random element from an array you pass in. Just creates easier to read code.
  // utils.getRandom(colors) just reads so much clearer than "colors[Math.floor(Math.random() * colors.length)]"
  getRandom (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // Give it a string and it returns it In Title Case. I always end up needing this fuction in my apps.
  // Another method that would be a good adition to the EcmaScript specification, along with deepEquals.
  titlize (str) {
    str = str.split(' ');
    var result = [];

    for (var i = 0; i < str.length; i++) {
      result[i] = str[i].charAt(0).toLocaleUpperCase() + str[i].slice(1);
    }
    return result.join(' ');
  },

  // Simple one but in general anything you're going to call over and over in all kinds of different places in your code
  // should be made into a function like this, even if it just replaces one line of code with a different one line.
  hapticFeedback (duration) {
    navigator.vibrate(duration);
  },

  // CALCULATES THE CURRENT MOON PHASE!! CREDIT TO USER ENDEL ON GITHUB!! AMAZING!!!
  calculateMoonPhase () {
    let month = (new Date()).getMonth() + 1;
    let year = (new Date()).getYear() + 1900;
    let day = (new Date()).getDate();

    if (month < 3) { year--; month += 12; }
    ++month;

    let c = 365.25 * year;
    let e = 30.6 * month;
    let jd = c + e + day - 694039.09; //jd is total days elapsed
    jd /= 29.5305882; //divide by the moon cycle
    let b = parseInt(jd); //int(jd) -> b, take integer part of jd
    jd -= b; //subtract integer part to leave fractional part of original jd
    b = Math.round(jd * 8); //scale fraction from 0-8 and round

    if (b >= 8 ) b = 0; //0 and 8 are the same so turn 8 into 0

    // 0 => New Moon
    // 1 => Waxing Crescent Moon
    // 2 => Quarter Moon
    // 3 => Waxing Gibbous Moon
    // 4 => Full Moon
    // 5 => Waning Gibbous Moon
    // 6 => Last Quarter Moon
    // 7 => Waning Crescent Moon

    return 'phase-' + b;
  },

  // COOKIES!!

  encodeSaveData () {
    let diceSkins = [];

    let compressData = function (data) {
      return parseInt(data.join(''), 2).toString(36);
    }

    // object keys aren't NECESSARILY ordered so we have to tell it the order to make sure it's always the same.
    let rarities = [ 'basic', 'rare', 'epic', 'mythic' ];

    for (let i = 0; i < rarities.length; i++) {
      diceSkins[i] = ['1'];

      for (let j = 0; j < settings.skins[rarities[i]].length; j++) {
        let has = settings.skins[rarities[i]][j].got;

        diceSkins[i].push(has ? '1' : '0');
      }

      diceSkins[i] = compressData(diceSkins[i]);
    }

    let userSettings = [
      settings.cookiesEnabled ? '1' : '0',
      settings.shakeToRoll ? '1' : '0',
      settings.vibrateOnCollision ? '1' : '0',
      settings.animationsEnabled ? '1' : '0'
    ];

    userSettings = compressData(userSettings);

    let diceSettings = [];

    let dieTypes = [ 'D100', 'D20', 'D12', 'D10', 'D8', 'D6', 'D4', 'D2', 'custom' ];

    for (let i = 0; i < dieTypes.length; i++) {
      let die = settings.diceRack[dieTypes[i]];

      diceSettings[i] = [];

      diceSettings[i].push(die.active ? '1' : '0');
      diceSettings[i].push(die.exploding ? '1' : '0');
      diceSettings[i].push(die.critSuccess ? '1' : '0');
      diceSettings[i].push(die.critFail ? '1' : '0');

      diceSettings[i] = compressData(diceSettings[i]);
    }

    diceSettings.push(settings.currentDiceSkin.split(' ').join('_'));

    let achievements = [];

    for (let i = 0; i < rollAchievements.length; i++) {
      achievements.push(rollAchievements[i].got ? '1' : '0');
    }

    achievements = compressData(achievements);

    let tableThemes = [];

    for (let i = 0; i < settings.tableThemes.length; i++) {
      tableThemes.push(settings.tableThemes[i].got ? '1' : '0');
    }

    tableThemes = [compressData(tableThemes)];

    tableThemes.push(settings.currentTableTheme.split(' ').join('_'));

    let critAnimations = { a: [[]], b: [[]], c: [[]] };

    for (let i = 0; i < settings.critAnimations.success.length; i++) {
      critAnimations.a[0].push(settings.critAnimations.success[i].got ? '1' : '0');
    }
    critAnimations.a[0] = compressData(critAnimations.a[0]);
    critAnimations.a.push(settings.currentCritAnimations.success.split(' ').join('_'));

    for (let i = 0; i < settings.critAnimations.fail.length; i++) {
      critAnimations.b[0].push(settings.critAnimations.fail[i].got ? '1' : '0');
    }
    critAnimations.b[0] = compressData(critAnimations.b[0]);
    critAnimations.b.push(settings.currentCritAnimations.fail.split(' ').join('_'));

    for (let i = 0; i < settings.critAnimations.explosion.length; i++) {
      critAnimations.c[0].push(settings.critAnimations.explosion[i].got ? '1' : '0');
    }
    critAnimations.c[0] = compressData(critAnimations.c[0]);
    critAnimations.c.push(settings.currentCritAnimations.explosion.split(' ').join('_'));

    return JSON.stringify({a: diceSkins, b: userSettings, c: diceSettings, d: achievements, e: tableThemes, f: critAnimations});
  },

  decodeSaveData () {

    let decompressData = function (data) {
      return parseInt(data, 36).toString(2).split('');
    }

    let save = JSON.parse(getCookie('save'));

    if (!save) return {};

    if (save.a) {
      for (let i = 0; i < save.a.length; i++) {
        save.a[i] = decompressData(save.a[i]);
      }
    }

    if (save.b) {
      save.b = decompressData(save.b);
    }

    if (save.c) {
      for (let i = 0; i < save.c.length - 1; i++) {
        save.c[i] = [0,0,0,0].concat(decompressData(save.c[i])).slice(-4);
      }

      save.c[save.c.length - 1] = save.c[save.c.length - 1].split('_').join(' ');
    }

    if (save.d) {
      save.d = decompressData(save.d);
    }

    if (save.e) {
      save.e = [decompressData(save.e[0]), save.e[1].split('_').join(' ')];
    }

    if (save.f) {
      save.f = {
        a: [decompressData(save.f.a[0]), save.f.a[1].split('_').join(' ')],
        b: [decompressData(save.f.b[0]), save.f.b[1].split('_').join(' ')],
        c: [decompressData(save.f.c[0]), save.f.c[1].split('_').join(' ')]
      }
    }

    return save;
  },

  canSaveCookies () {
    return isCookieEnabled();
  },

  saveProgress () {
    if (!settings.cookiesEnabled) return;

    setCookie('save', this.encodeSaveData());
  },

  loadSave () {
    let saveData = this.decodeSaveData();

    if (saveData.a) {
      let rarities = [ 'basic', 'rare', 'epic', 'mythic' ];

      for (let i = 0; i < rarities.length; i++) {
        saveData.a[i].shift();
        for (let j = 0; j < settings.skins[rarities[i]].length; j++) {
          settings.skins[rarities[i]][j].got = !!parseInt(saveData.a[i][j]);
        }
      }
    }

    if (saveData.b) {
      settings.cookiesEnabled = !!parseInt(saveData.b[0]);
      settings.shakeToRoll = !!parseInt(saveData.b[1]);
      settings.vibrateOnCollision = !!parseInt(saveData.b[2]);
      settings.animationsEnabled = !!parseInt(saveData.b[3]);

    }

    if (saveData.c) {
      let dieTypes = ['D100', 'D20', 'D12', 'D10', 'D8', 'D6', 'D4', 'D2', 'custom'];

      for (let i = 0; i < dieTypes.length - 1; i++) {
        settings.diceRack[dieTypes[i]].active = !!parseInt(saveData.c[i][0]);
        settings.diceRack[dieTypes[i]].exploding = !!parseInt(saveData.c[i][1]);
        settings.diceRack[dieTypes[i]].critSuccess = !!parseInt(saveData.c[i][2]);
        settings.diceRack[dieTypes[i]].critFail = !!parseInt(saveData.c[i][3]);
      }

      settings.currentDiceSkin = saveData.c[dieTypes.length];
    }

    if (saveData.d) {
      for (let i = 0; i < rollAchievements.length; i++) {
        if (!saveData.d[i]) saveData.d[i] = 0;
        rollAchievements[i].got = !!parseInt(saveData.d[i]);
      }
    }

    if (saveData.e) {
      for (let i = 0; i < settings.tableThemes.length; i++) {
        if (!saveData.e[0][i]) saveData.e[0][i] = 0;
        settings.tableThemes[i].got = !!parseInt(saveData.e[0][i]);
      }

      settings.currentTableTheme = saveData.e[1];
    }

    if (saveData.f) {
      for (let i = 0; i < settings.critAnimations.success.length; i++) {
        if (!saveData.f.a[0][i]) saveData.f.a[0][i] = 0;
        settings.critAnimations.success[i].got = !!parseInt(saveData.f.a[0][i]);
      }
      settings.currentCritAnimations.success = saveData.f.a[1];

      for (let i = 0; i < settings.critAnimations.fail.length; i++) {
        if (!saveData.f.b[0][i]) saveData.f.b[0][i] = 0;
        settings.critAnimations.fail[i].got = !!parseInt(saveData.f.b[0][i]);
      }
      settings.currentCritAnimations.fail = saveData.f.b[1];

      for (let i = 0; i < settings.critAnimations.explosion.length; i++) {
        if (!saveData.f.c[0][i]) saveData.f.c[0][i] = 0;
        settings.critAnimations.explosion[i].got = !!parseInt(saveData.f.c[0][i]);
      }
      settings.currentCritAnimations.explosion = saveData.f.c[1];

    }
  },

  deleteSave () {
    removeCookie('save');
  }
}
