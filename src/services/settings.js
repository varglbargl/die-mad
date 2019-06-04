export default {
  skins: {
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
    fire:    'default fire',
    ice:     'default ice',
    krypton: 'default krypton',
    kirby:   'default kirby',

    lesbian: 'pattern lesbian',
    gay:     'pattern gay',
    bi:      'pattern bi',
    trans:   'pattern trans',

    random:  'random'
  },

  currentDiceSkin: 'default red',

  shakeToRoll: true,

  vibrateOnCollision: false,

  animationsEnabled: true,

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
    let skinList = Object.keys(this.skins)
    if (seed) {
      return this.skins[skinList[seed % (skinList.length - 1)]]; // -1 because random
    } else {
      return this.skins[skinList[Math.floor(Math.random() * skinList.length - 1)]];
    }
  }
}
