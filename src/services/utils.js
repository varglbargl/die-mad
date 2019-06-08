import { isCookieEnabled, getCookie, setCookie, removeCookie } from 'tiny-cookie';
import settings from '@/services/settings.js';
import { streakAchievements, rollAchievements } from '@/services/cheevos.js';

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

  // COOKIES!!

  encodeSaveData () {
    let unlocks = [];

    let compressData = function (data) {
      return parseInt(data.join(''), 2).toString(36);
    }

    let rarities = Object.keys(settings.skins).sort();

    for (let i = 0; i < rarities.length; i++) {
      for (let j = 0; j < settings.skins[rarities[i]].length; j++) {
        let has = settings.skins[rarities[i]][j].has; // oof

        unlocks.push(has ? '1' : '0');
      }
    }

    unlocks = compressData(unlocks);

    let userSettings = [
      settings.cookiesEnabled ? '1' : '0',
      settings.shakeToRoll ? '1' : '0',
      settings.vibrateOnCollision ? '1' : '0',
      settings.animationsEnabled ? '1' : '0'
    ];

    userSettings = compressData(userSettings);

    let diceSettings = ['1'];

    let dieTypes = ['D100', 'D20', 'D12', 'D10', 'D8', 'D6', 'D4', 'D2', 'custom'];

    for (let i = 0; i < dieTypes.length; i++) {
      let die = settings.diceRack[dieTypes[i]];

      diceSettings.push(die.active ? '1' : '0');
      diceSettings.push(die.exploding ? '1' : '0');
      diceSettings.push(die.critSuccess ? '1' : '0');
      diceSettings.push(die.critFail ? '1' : '0');
    }

    diceSettings = settings.currentDiceSkin.split(' ').join('_') + ';' + compressData(diceSettings);

    let achievements = ['1'];

    let cheevoTypes = [streakAchievements, rollAchievements];

    for (var i = 0; i < cheevoTypes.length; i++) {
      for (var j = 0; j < cheevoTypes[i].length; j++) {
        achievements.push(cheevoTypes[i][j].got ? '1' : '0');
      }
    }

    achievements = compressData(achievements);

    return {unlocks, userSettings, diceSettings, achievements};
  },

  decodeSaveData () {

    let decompressData = function (data) {
      return parseInt(data, 36).toString(2).split('');
    }

    let unlocks = getCookie('unlocks');
    if (unlocks) unlocks = decompressData(unlocks);

    let userSettings = getCookie('userSettings');
    if (userSettings) userSettings = decompressData(userSettings);

    let diceSettings = getCookie('diceSettings');
    if (diceSettings) {
      diceSettings = diceSettings.split(';');

      let currentDiceSkin = diceSettings[0];
      diceSettings = decompressData(diceSettings[1]).splice(1);
      diceSettings.unshift(currentDiceSkin);
    }

    let achievements = getCookie('achievements');
    if (achievements) achievements = decompressData(achievements).splice(1);

    return {unlocks, userSettings, diceSettings, achievements}
  },

  canSaveCookies () {
    return isCookieEnabled();
  },

  saveProgress () {
    if (!settings.cookiesEnabled) return;

    setCookie('unlocks', this.encodeSaveData().unlocks);
    setCookie('userSettings', this.encodeSaveData().userSettings);
    setCookie('diceSettings', this.encodeSaveData().diceSettings);
    setCookie('achievements', this.encodeSaveData().achievements);
  },

  loadSave () {
    let saveData = this.decodeSaveData();

    if (saveData.unlocks) {
      let rarities = Object.keys(settings.skins).sort();

      for (let i = 0, j = 0, k = 0; i < saveData.unlocks.length; i++, j++) { // OOF
        let currentRarity = rarities[k];

        if (j >= settings.skins[currentRarity].length) {
          j = 0;
          currentRarity = rarities[++k];
        }
        settings.skins[currentRarity][j].has = !!parseInt(saveData.unlocks[i]);
      }
    }

    if (saveData.userSettings) {
      settings.cookiesEnabled = !!parseInt(saveData.userSettings[0]);
      settings.shakeToRoll = !!parseInt(saveData.userSettings[1]);
      settings.vibrateOnCollision = !!parseInt(saveData.userSettings[2]);
      settings.animationsEnabled = !!parseInt(saveData.userSettings[3]);
    }

    if (saveData.diceSettings) {
      let dieTypes = ['D100', 'D20', 'D12', 'D10', 'D8', 'D6', 'D4', 'D2', 'custom'];

      settings.currentDiceSkin = saveData.diceSettings[0].split('_').join(' ');

      for (let i = 1; i < dieTypes.length; i++) {
        settings.diceRack[dieTypes[i]].active = !!parseInt(saveData.diceSettings[i * 4 + 1]);
        settings.diceRack[dieTypes[i]].exploding = !!parseInt(saveData.diceSettings[i * 4 + 2]);
        settings.diceRack[dieTypes[i]].critSuccess = !!parseInt(saveData.diceSettings[i * 4 + 3]);
        settings.diceRack[dieTypes[i]].critFail = !!parseInt(saveData.diceSettings[i * 4 + 4]);
      }
    }

    if (saveData.achievements) {

      let cheevoTypes = [streakAchievements, rollAchievements];

      for (let i = 0, j = 0, k = 0; i < saveData.achievements.length; i++, j++) {
        if (!cheevoTypes[k][j]) {
          j = 0;
          k++;
        }

        cheevoTypes[k][j].got = !!parseInt(saveData.achievements[i]);
      }
    }
  },

  deleteSave () {
    removeCookie('unlocks');
    removeCookie('userSettings');
    removeCookie('diceSettings');
    removeCookie('achievements');
  }
}
