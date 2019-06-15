import utils from '@/services/utils.js';

export default {

  // Toggle for shaking your device to roll dice. Modify this all you want, if your device and/or browser don't have
  // access to the accelerometer API it will just never emit a motion event and nothing will happen but it won't break.
  shakeToRoll: true,

  // Toggle for the haptic feedback option in the menu. Don't manipulate this directly, if it's set to true and your
  // device and/or browser do not have access to the vibration API then dice will just freak out when they hit a wall.
  vibrateOnCollision: false,

  // Toggle for dice rolling animations. If this is false dice will just flip instantly to a random side when "rolled."
  animationsEnabled: true,

  // Initially set to the default of whether or not you have cookies enabled. Mapped to the option in the settings.
  cookiesEnabled: false,

  toggleCookiesEnabled () {
    this.cookiesEnabled = !this.cookiesEnabled;
    if (this.cookiesEnabled) {
      utils.saveProgress();
    } else {
      utils.deleteSave();
    }
  },

  // Here it is. The dice skins. What are they called? Do you have them? What is the CSS class for displaying the skin?
  // From now on, never rearrange these dice. Only add dice onto the end so it doesn't mess up people's saves.
  skins: {
    basic: [
      { name: 'Red',      class: 'default red',        got: true },
      { name: 'Orange',   class: 'default orange',     got: true },
      { name: 'Yellow',   class: 'default yellow',     got: true },
      { name: 'Green',    class: 'default green',      got: true },
      { name: 'Blue',     class: 'default blue',       got: true },
      { name: 'Purple',   class: 'default purple',     got: true },
      { name: 'Black',    class: 'default black',      got: true },
      { name: 'White',    class: 'default white',      got: true },
      { name: 'Pink',     class: 'default pink',       got: false },
      { name: 'Navy',     class: 'default navy',       got: false },
      { name: 'Teal',     class: 'default teal',       got: false },
      { name: 'Wood',     class: 'default wood',       got: false },
      { name: 'Shale',    class: 'default shale',      got: false },
      { name: 'Fog',      class: 'default fog',        got: false },
      { name: 'Olive',    class: 'default olive',      got: false },
      { name: 'Steel',    class: 'default steel',      got: false },
      { name: 'Pear',     class: 'default pear',       got: false },
      { name: 'Ivory',    class: 'default ivory',      got: false },
      { name: 'Ochre',    class: 'default ochre',      got: false },
      { name: 'Clay',     class: 'default clay',       got: false },
      { name: 'Amber',    class: 'default amber',      got: false },
      { name: 'Indigo',   class: 'default indigo',     got: false },
      { name: 'Khaki',    class: 'default khaki',      got: false },
      { name: 'Lilac',    class: 'default lilac',      got: false },
      { name: 'Jade',     class: 'default jade',       got: false },
      { name: 'Coral',    class: 'default coral',      got: false },
      { name: 'Rose',     class: 'default rose',       got: false },
      { name: 'Sky',      class: 'default sky',        got: false },
      { name: 'Crimson',  class: 'default crimson',    got: false },
      { name: 'Lemon',    class: 'default lemon',      got: false },
      { name: 'Latte',    class: 'default latte',      got: false },
      { name: 'Cobalt',   class: 'default cobalt',     got: false }
    ],

    rare: [
      { name: 'Fire',     class: 'neon fire',          got: false },
      { name: 'Ice',      class: 'neon ice',           got: false },
      { name: 'Krypton',  class: 'neon krypton',       got: false },
      { name: 'Kirby',    class: 'neon kirby',         got: false },
      { name: 'Shrimps',  class: 'neon headache',      got: false },
      { name: 'Xenon',    class: 'neon toxic',         got: false },
      { name: 'Tropics',  class: 'neon tropics',       got: false },
      { name: 'Lapis',    class: 'neon lapis',         got: false },
      { name: 'Lesbian',  class: 'pattern lesbian',    got: false },
      { name: 'Gay',      class: 'pattern gay',        got: false },
      { name: 'Bi',       class: 'pattern bi',         got: false },
      { name: 'Trans',    class: 'pattern trans',      got: false },
      { name: 'Pan',      class: 'pattern pan',        got: false },
      { name: 'Enby',     class: 'pattern nonbinary',  got: false },
      { name: 'Ace',      class: 'pattern ace',        got: false },
      { name: 'Aro',      class: 'pattern aro',        got: false },
      { name: 'Intersex', class: 'pattern intersex',   got: false },
      { name: 'Genderfluid',class: 'pattern genderfluid',got: false }
    ],

    epic: [
      { name: 'Beat',     class: 'default beat',       got: false },
      { name: 'Tab',      class: 'default tab',        got: false },
      { name: 'Mew',      class: 'default mew',        got: false },
      { name: 'Yo-Yo',    class: 'default yoyo',       got: false },
      { name: 'Poison',   class: 'default poison-jam', got: false },
      { name: 'Shock',    class: 'default love-shock', got: false },
      { name: 'Noise',    class: 'default noise-tank', got: false },
      { name: 'Rhino',    class: 'default rhino',      got: false },
      { name: 'Marble',   class: 'pattern marble',     got: false },
      { name: 'Spoopy',   class: 'default halloween',  got: false,  event: 'Halloween' },
      { name: 'Cupid',    class: 'default valentines', got: false,  event: 'Valentines Day' }
    ],

    mythic: [
      { name: 'Lava',     class: 'animated lava-lamp', got: false },
      { name: 'Laika',    class: 'animated moon',      got: false }
    ]
  },

  // This is the dice skin you have selected in the menu.
  currentDiceSkin: 'default red',

  // TABLE THEMES

  // Works basically like the dice skins. They have a name, a class, and whether or not you have it.
  tableThemes: [
    { name: 'Felt',      class: 'strexture felt',    got: true },
    { name: 'Space 1',   class: 'strexture space1',  got: true }
  ],

  currentTableTheme: 'strexture felt',

  // CRIT ANIMATIONS

  critAnimations: {
    success: [
      { name: 'Default', type: 'success default',   duration: 0.7, got: true },
      { name: 'Pixel',   type: 'success pixel',     duration: 0.6, got: true }
    ],
    fail: [
      { name: 'Default', type: 'fail default',      duration: 1,   got: true },
      { name: 'Pixel',   type: 'fail pixel',        duration: 0.7, got: true }
    ],
    explosion: [
      { name: 'Default', type: 'explosion default', duration: 1,   got: true },
      { name: 'Pixel',   type: 'explosion pixel',   duration: 0.7, got: true }
    ]
  },

  currentCritAnimations: {
    success: 'success default',
    fail: 'fail default',
    explosion: 'explosion default'
  },

  getAnimationDuration (type) {
    for (let crit in this.critAnimations) {
      for (var i = 0; i < this.critAnimations[crit].length; i++) {
        if (this.critAnimations[crit][i].type === type) return this.critAnimations[crit][i].duration;
      }
    }
  },

  // This is only really useful so the "All" option in the Dice Settings section of the menu has a model.
  allDice: {
    active: false,
    exploding: false,
    critSuccess: false,
    critFail: false
  },

  // "All" wouldn't mean All unless checking it went through and actually changed all the settings, now would it?
  // This method does that.
  toggleAllDiceSetting (attr) {
    this.allDice[attr] = !this.allDice[attr];

    for (let i in this.diceRack) {
      this.diceRack[i][attr] = this.allDice[attr];
    }
  },

  // The settings object for the different types of dice. Directly mapped to the Dice Settings checkboxes in the menu.
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

  // Gets the settings object for random dice, if none exist it returns the custom dice settings.
  // Uses d instead of this.diceRack.custom.sides because dice with other sides may still exist on the table
  // but would crash when they try to check if they can crit if you've changed the sides in the settings.
  getDieSettings (d) {
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

  // Gets a random die skin from the skins you have and returns the associated class.
  // Seed exists for things like the dice rack that can't be random or they'd change all the time
  // but seed can also be used to cycle through owned dice in order by passing in 1, then 2, then 3, etc.
  getRandomDieSkin (seed) {
    let skinList = [];

    for (let rarity in this.skins) {
      for (let skin in this.skins[rarity]) {
        if (this.skins[rarity][skin].got) skinList.push(this.skins[rarity][skin].class);
      }
    }

    if (seed) {
      return skinList[seed % skinList.length];
    } else {
      return skinList[Math.floor(Math.random() * skinList.length)];
    }
  },

  // Awards a random die skin. You can specify a minimum rarity to guarantee at least a rare for example.
  // minRarity is useful for "card pack" style rewards where they should be guaranteed at least one rare, for example.
  awardRandomDie (minRarity, duplicates) {
    let availableDice = [];
    let roll = Math.random() * 100;
    let rarity;

    // this way you always have the same chance of getting an Epic or mythicary, even if you set the minimum to Rare etc.
    if (minRarity === 'rare') {
      roll = Math.max(roll, 70);
    } else if (minRarity === 'epic') {
      roll = Math.max(roll, 90);
    } else if (minRarity === 'mythic') {
      roll = 100;
    } // else if minRarity === 'basic' || !minRarity (they're the same thing if you think about it)

    if (roll > 99.5) {
      rarity = 'mythic';
    } else if (roll >= 90) {
      rarity = 'epic';
    } else if (roll >= 70) {
      rarity = 'rare';
    } else {
      rarity = 'basic';
    }

    for (let skin in this.skins[rarity]) {
      if (duplicates) {
        availableDice.push(this.skins[rarity][skin]);
      } else {
        if (!this.skins[rarity][skin].got && !this.skins[rarity][skin].event) {
          availableDice.push(this.skins[rarity][skin]);
        }
      }
    }

    if (availableDice.length === 0) {
      // Gotta handle this somehow. This happens when you have all the dice skins of the rarity you rolled.
      // Award a crafting resource (glitter)? Default to the next rarity up and try again? What if you have ALL skins??
      // Honestly, short term solution (and something I'm gonna have to do anyway) is to add like 100 new basic skins lol
      return this.awardRandomDie(minRarity, true);
    }

    let randomAvailableDie = utils.getRandom(availableDice);

    randomAvailableDie.got = true;
    randomAvailableDie.rarity = rarity;

    utils.saveProgress();

    return randomAvailableDie;
  },

  awardSpecificDie (name) {
    for (let rarity in this.skins) {
      for (let i = 0; i < this.skins[rarity].length; i++) {
        if (this.skins[rarity][i].name === name) {
          this.skins[rarity][i].got = true;
          this.skins[rarity][i].rarity = rarity;

          utils.saveProgress();
          return this.skins[rarity][i];
        }
      }
    }
  }

}
