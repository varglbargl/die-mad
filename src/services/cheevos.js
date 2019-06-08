import settings from '@/services/settings.js';

// ACHIEVEMENT TYPE: STREAK - Achievements that have to do with crits, fails, and explosions

var streaks = {};

var streakAchievements = {
  threeExplosions: {
    requirement () {
      if (streaks.explosion) {
        return streaks.explosion.length >= 3;
      }
    },
    name: 'The Ol\' Spicy Dice Bag',
    description: 'Get 3 exploding dice in one roll.',
    reward: 'basic',
    got: false
  },

  threeCrits: {
    requirement () {
      if (streaks.critSuccess) {
        return streaks.critSuccess.length >= 3;
      }
    },
    name: 'Crit Criminal',
    description: 'Get 3 critical successes in one roll.',
    reward: 'rare',
    got: false
  },

  threeFails: {
    requirement () {
      if (streaks.critFail) {
        return streaks.critFail.length >= 3;
      }
    },
    name: 'Critters Never Win',
    description: 'Get 3 critical fails in one roll.',
    reward: 'epic',
    got: false
  }
};

var checkStreakAchievements = function () {
  for (let cheevo in streakAchievements) {
    if (!streakAchievements[cheevo].got && streakAchievements[cheevo].requirement()) {
      earnAchievement(streakAchievements[cheevo]);
    }
  }
};

var addToStreak = function (type, data) {
  if (!streaks[type]) {
    streaks[type] = [];
  }

  streaks[type].push(data);

  checkStreakAchievements();
};

var resetStreaks = function () {
  for (let streak in streaks) {
    delete streaks[streak];
  }
};

// ACHIEVEMENT TYPE: ROLL - Anything that needs to check the outcome of rolls.

var totalRolls = 0;
var rolls = [];

var rollAchievements = {
  rollOne: {
    requirement () {
      return totalRolls > 0;
    },
    name: 'Babby\'s First Roll',
    description: 'Roll one single die ever.',
    reward: 'basic',
    got: false
  },

  oneOfEach: {
    requirement () {
      let types = {};

      for (var i = 0; i < rolls.length; i++) {
        types[rolls[i].sides] = true;
      }

      if (types[20] && types[12] && types[10] && types[8] && types[6] && types[4]) {
        return true;
      }
    },
    name: 'One Of Everything',
    description: 'Roll one of each of the default dice at once.',
    reward: 'basic',
    got: false
  },

  deeSixtyNine: {
    requirement () {
      for (var i = 0; i < rolls.length; i++) {
        if (rolls[i].sides == 69) return true;
      }
    },
    name: 'The Weed Number',
    description: 'Roll a d69.',
    reward: 'basic',
    got: false
  },

  deeFourTwenty: {
    requirement () {
      for (var i = 0; i < rolls.length; i++) {
        if (rolls[i].sides == 420) return true;
      }
    },
    name: 'The Sex Number',
    description: 'Roll a d420.',
    reward: 'basic',
    got: false
  },

  sixtyNineOnADeeFourTwenty: {
    requirement () {
      for (var i = 0; i < rolls.length; i++) {
        if (rolls[i].sides == 420 && rolls[i].roll == 69) return true;
      }
    },
    name: 'NICE NICE NICE NICE NICE NICE NICE',
    description: 'Roll a 69 on a d420.',
    reward: 'legend',
    got: false,
    secret: true
  },

  oneHundredRolls: {
    requirement () {
      if (totalRolls > 100) return true;
    },
    name: '100 Dice!',
    description: 'Roll a hundred dice ever.',
    reward: 'basic',
    got: false
  },

  fiveHundredRolls: {
    requirement () {
      if (totalRolls > 500) return true;
    },
    name: '500 Dice!!',
    description: 'Roll five hundred dice ever.',
    reward: 'rare',
    got: false
  },

  oneThousandRolls: {
    requirement () {
      if (totalRolls > 1000) return true;
    },
    name: '1,000 Dice!!!',
    description: 'Roll a thousand dice ever.',
    reward: 'epic',
    got: false
  },

  fiveThousandRolls: {
    requirement () {
      if (totalRolls > 5000) return true;
    },
    name: '5,000 DICE!?!?',
    description: 'Roll five thousand dice ever.',
    reward: 'epic',
    got: false
  }
};

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

var resetRolls = function () {
  rolls = [];
}

// BASIC ACHIEVEMENT FUNCTIONALITY

var recentAchievements = [];

var awardReward = function (type) {
  if (type === 'basic' || type === 'rare' || type === 'epic' || type === 'legend') {
    return settings.awardRandomDie(type);
  } // else add and handle other types of rewards (crit animations, board themes, DICE PACKS???)
};

var count = 0; // stupid but it works

var earnAchievement = function (cheevo) {
  cheevo.got = true;
  cheevo.rewarded = awardReward(cheevo.reward);
  recentAchievements.push({info: cheevo, id: ++count});
}

var checkAchievements = function () {
  checkStreakAchievements();
  checkRollAchievements();
};

export {
  addToStreak,
  resetStreaks,
  addToRolls,
  resetRolls,
  checkAchievements,
  streakAchievements,
  rollAchievements,

  recentAchievements
};
