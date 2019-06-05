export default {
  skins: {
    common: {
      red:     'default red',
      orange:  'default orange',
      yellow:  'default yellow',
      green:   'default green',
      blue:    'default blue',
      purple:  'default purple',
      pink:    'default pink',
      navy:    'default navy',
      teal:    'default teal',
      wood:    'default wood',
      black:   'default black',
      white:   'default white',

      fire:    'neon fire',
      ice:     'neon ice',
      krypton: 'neon krypton',
      kirby:   'neon kirby'
    },

    uncommon: {
      beat:    'default beat',
      tab:     'default tab',
      mew:     'default mew',
      'Yo-Yo': 'default yoyo',
      poison:  'default poison-jam',
      shock:   'default love-shock',
      noise:   'default noise-tank',
      rhino:   'default rhino'
    },

    rare: {
      lesbian: 'pattern lesbian',
      gay:     'pattern gay',
      bi:      'pattern bi',
      trans:   'pattern trans',
      pan:     'pattern pan',
      enby:    'pattern nonbinary',
      'Ace/Aro':'pattern ace',
      intersex:'pattern intersex'
    }
  },

  currentDiceSkin: 'default red',

  shakeToRoll: true,

  vibrateOnCollision: false,

  animationsEnabled: true,

  allDice: {
    active: false,
    exploding: false,
    critSuccess: false,
    critFail: false
  },

  toggleAllDiceSetting (attr) {
    this.allDice[attr] = !this.allDice[attr];

    for (let i in this.diceRack) {
      this.diceRack[i][attr] = this.allDice[attr];
    }
  },

  diceRack: {
    D100: {
      active: false,
      sides: 100,
      exploding: false,
      critSuccess: false,
      critFail: false
    },
    D20: {
      active: true,
      sides: 20,
      exploding: false,
      critSuccess: true,
      critFail: true
    },
    D12: {
      active: true,
      sides: 12,
      exploding: false,
      critSuccess: false,
      critFail: false
    },
    D10: {
      active: true,
      sides: 10,
      exploding: false,
      critSuccess: false,
      critFail: false
    },
    D8: {
      active: true,
      sides: 8,
      exploding: false,
      critSuccess: false,
      critFail: false
    },
    D6: {
      active: true,
      sides: 6,
      exploding: false,
      critSuccess: false,
      critFail: false
    },
    D4: {
      active: true,
      sides: 4,
      exploding: false,
      critSuccess: false,
      critFail: false
    },
    D2: {
      active: false,
      sides: 2,
      exploding: false,
      critSuccess: false,
      critFail: false
    },
    custom: {
      active: false,
      sides: 69,
      exploding: false,
      critSuccess: false,
      critFail: false
    }
  },

  getDieSettings(d) {
    for (let die in this.diceRack) {
      if (this.diceRack[die].sides === d) return this.diceRack[die];
    }

    return {
      active: this.diceRack.custom.active,
      sides: d,
      exploding: this.diceRack.custom.exploding,
      critSuccess: this.diceRack.custom.critSuccess,
      critFail: this.diceRack.custom.critFail
    };
  },

  getRandomDieSkin(seed) {
    let skinList = [];

    for (let rarity in this.skins) {
      for (let skin in this.skins[rarity]) {
        skinList.push(this.skins[rarity][skin]);
      }
    }

    if (seed) {
      return skinList[seed % (skinList.length - 1)]; // -1 because random
    } else {
      return skinList[Math.floor(Math.random() * (skinList.length - 1))];
    }
  }
}
