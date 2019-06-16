<template>
  <div class="cheevo-list">
    <div
    class="cheevo"
    v-for="(cheevo, i) in recentAchievements"
    :key="cheevo.id"
    @click="dismissAchievement(i)">
      <div class="info">
        <h2>ACHIEVEMENT</h2>
        <h3>{{ cheevo.info.name }}</h3>
        <span>{{ cheevo.info.description }}</span>
      </div>
      <div style="display: flex; align-items: center;">
        <div class="reward-card" :class="cheevo.info.rewarded.rarity">
          <div
          class="die d20"
          :class="[cheevo.info.rewarded.class, moonPhase(cheevo.info.rewarded.class)]">
            <div class="skin"></div>
            <span> 20 </span>
          </div>
          <span
          style="font-weight: 500;"
          :style="cheevo.info.reward.class === 'pattern genderfluid' ? 'letter-spacing: -1.6px; font-size: 15px;' : ''">
            {{ cheevo.info.rewarded.name }}
          </span>
          <crit-animation
          @kill="stopAnimation(i)"
          v-if="stoppedAnimations[i] !== true"
          :type="settings.currentCritAnimations.success"
          x="2"
          y="0" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CritAnimation from '@/components/CritAnimation.vue';

import { recentAchievements } from '@/services/cheevos.js';
import settings from '@/services/settings.js';
import utils from '@/services/utils.js';

export default {
  name: 'Achievements',
  components: { CritAnimation },
  data() {
    return {
      settings,
      recentAchievements,
      stoppedAnimations: []
    }
  },
  methods: {
    dismissAchievement (index) {
      recentAchievements.splice(index, 1);
      this.stoppedAnimations.splice(index, 1);
    },
    stopAnimation (index) {
      this.stoppedAnimations[index] = true;
      this.$forceUpdate(); // I cannot believe this is necessarry... WHY??
    },
    moonPhase (skin) {
      if (skin === 'animated moon') {
        return utils.calculateMoonPhase();
      } else {
        return '';
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.cheevo-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  z-index: 50;
}

.cheevo {
  cursor: pointer;
  padding: 10px;
  margin: 8px auto;
  width: 300px;
  border-radius: 8px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  background-color: #222;

  color: #FFF;

  h2, h3 {
    margin: 0;
  }

  h2 {
    color: $red;
    font-style: italic;
  }

  .info {
    flex: 1;
    margin-right: 2px;
  }

  .reward-card {
    position: relative;
    border: 3px solid #111;
    border-radius: 5px;
    cursor: pointer;

    .die {
      position: unset;
      margin: 0 auto;

      span {
        left: calc(50% - 14px);
        width: auto;
      }
    }
  }
}
</style>
