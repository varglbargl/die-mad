import settings from '@/services/settings.js';

// ACHIEVEMENT TYPE: ROLL - Anything that needs to check the outcome of rolls.

var totalRolls = 0;
var rolls = [];

var rollAchievements =  [
  {
    name: 'Babby\'s First Roll',
    description: 'Roll one single die ever.',
    requirement () {
      return totalRolls > 0;
    },
    reward: 'basic',
    got: false
  }, {
    name: 'The Ol\' Spicy Dice Bag',
    description: 'Get 3 exploding dice in one roll.',
    requirement () {
      if (streaks.explosion) {
        return streaks.explosion.length >= 3;
      }
    },
    reward: 'basic',
    got: false
  }, {
    name: 'Crit Criminal',
    description: 'Get 3 critical successes in one roll.',
    requirement () {
      if (streaks.critSuccess) {
        return streaks.critSuccess.length >= 3;
      }
    },
    reward: 'rare',
    got: false
  }, {
    name: 'Critters Never Win',
    description: 'Get 3 critical fails in one roll.',
    requirement () {
      if (streaks.critFail) {
        return streaks.critFail.length >= 3;
      }
    },
    reward: 'epic',
    got: false
  }, {
    name: 'Rollin on Dubs',
    description: 'Get 2 crits with 2 different types of dice in one roll.',
    requirement () {
      let types = [];

      if (streaks.critSuccess) {
        for (let i = 0; i < streaks.critSuccess.length; i++) {
          types.push(streaks.critSuccess[i]);

          for (let j = 0; j < types.length; j++) {
            if (streaks.critSuccess[i] !== types[j]) return true;
          }
        }
      }
    },
    reward: 'rare',
    got: false
  }, {
    name: 'A Land of Contrasts',
    description: 'Get a crit success and a crit fail in one roll.',
    requirement () {
      if (streaks.critSuccess && streaks.critFail) return true;
    },
    reward: 'basic',
    got: false
  }, {
    name: 'One Of Everything',
    description: 'Roll one of each of the default dice at once.',
    requirement () {
      let types = {};

      for (let i = 0; i < rolls.length; i++) {
        types[rolls[i].sides] = true;
      }

      if (types[20] && types[12] && types[10] && types[8] && types[6] && types[4]) {
        return true;
      }
    },
    reward: 'basic',
    got: false
  }, {
    name: 'The Weed Number',
    description: 'Roll a d69.',
    requirement () {
      for (let i = 0; i < rolls.length; i++) {
        if (rolls[i].sides == 69) return true;
      }
    },
    reward: 'basic',
    got: false
  }, {
    name: 'The Sex Number',
    description: 'Roll a d420.',
    requirement () {
      for (let i = 0; i < rolls.length; i++) {
        if (rolls[i].sides == 420) return true;
      }
    },
    reward: 'basic',
    got: false
  }, {
    name: 'NICE NICE NICE NICE NICE NICE NICE',
    description: 'Roll a 69 on a d420.',
    requirement () {
      for (let i = 0; i < rolls.length; i++) {
        if (rolls[i].sides == 420 && rolls[i].roll == 69) return true;
      }
    },
    reward: 'mythic',
    got: false,
    secret: true
  }, {
    name: '100 Dice!',
    description: 'Roll a hundred dice ever.',
    requirement () {
      if (totalRolls > 100) return true;
    },
    reward: 'basic',
    got: false
  }, {
    name: '500 Dice!!',
    description: 'Roll five hundred dice ever.',
    requirement () {
      if (totalRolls > 500) return true;
    },
    reward: 'rare',
    got: false
  }, {
    name: '1,000 Dice!!!',
    description: 'Roll a thousand dice ever.',
    requirement () {
      if (totalRolls > 1000) return true;
    },
    reward: 'epic',
    got: false
  }, {
    name: '5,000 DICE!?!?',
    description: 'Roll five thousand dice ever.',
    requirement () {
      if (totalRolls > 5000) return true;
    },
    reward: 'epic',
    got: false
  }, {
    name: 'TRANS RIGHTS',
    description: 'Roll a die during pride month.',
    requirement () {
      if ((new Date()).getMonth() === 5) return true;
    },
    reward () {
      let gayDice = ['Lesbian', 'Gay', 'Bi', 'Trans', 'Pan', 'Enby', 'Ace/Aro', 'Intersex'];

      for (let i = 0; i < settings.skins.rare.length; i++) {
        if (gayDice.indexOf(settings.skins.rare[i].name) !== -1) {
          settings.skins.rare[i].has = true;
        }
      }

      return {name: 'Dice x8', class: 'pattern gay', rarity: 'rare'};
    },
    rarity: 'rare',
    got: false
  }
];

var checkRollAchievements = function () {
  for (let cheevo in rollAchievements) {
    if (!rollAchievements[cheevo].got && rollAchievements[cheevo].requirement()) {
      earnAchievement(rollAchievements[cheevo]);
    }
  }
};

var addToRolls = function (roll, sides) {
  rolls.push({roll, sides});
  totalRolls++;

  checkRollAchievements();
};

var resetRollTracking = function () {
  rolls = [];
  streaks = {};
}

var streaks = {};

var addToStreak = function (type, data) {
  if (!streaks[type]) {
    streaks[type] = [];
  }

  streaks[type].push(data);

  checkRollAchievements();
};

// BASIC ACHIEVEMENT FUNCTIONALITY

var recentAchievements = [];

var awardReward = function (reward) {
  if (typeof reward === 'function') {
    return reward();
  }

  if (reward === 'basic' || reward === 'rare' || reward === 'epic' || reward === 'mythic') {
    return settings.awardRandomDie(reward);
  } // else add and handle other types of rewards (crit animations, board themes, DICE PACKS???)
};

var count = 0; // stupid but it works

var earnAchievement = function (cheevo) {
  cheevo.got = true;
  cheevo.rewarded = awardReward(cheevo.reward);
  recentAchievements.push({info: cheevo, id: ++count});
}

export {
  addToStreak,
  addToRolls,
  resetRollTracking,
  rollAchievements,

  recentAchievements
};
