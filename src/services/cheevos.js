import settings from '@/services/settings.js';

var streaks = {};

var streakAchievements = {
  threeExplosions: {
    requirement () {
      if (streaks.explosion) {
        return streaks.explosion.length >= 3;
      }
    },
    name: 'Explosive',
    description: 'Get 3 exploding dice on one roll.',
    reward: 'basic',
    got: false
  },

  threeCrits: {
    requirement () {
      if (streaks.critSuccess) {
        return streaks.critSuccess.length >= 3;
      }
    },
    name: 'Critters Always Win',
    description: 'Get 3 critical successes on one roll.',
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
    description: 'Get 3 critical successes on one roll.',
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

var awardReward = function (type) {
  if (type === 'basic' || type === 'rare' || type === 'epic' || type === 'legend') {
    return settings.awardRandomDie(type);
  }
};

var earnAchievement = function (cheevo) {
  cheevo.got = true;
  cheevo.reward = awardReward(cheevo.reward);
  recentAchievements.push({cheevo, id: ++count});
}

var recentAchievements = [];

var count = 0;

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

var checkAchievements = function () {
  checkStreakAchievements();
};

export {
  addToStreak,
  resetStreaks,
  checkAchievements,
  recentAchievements
};
