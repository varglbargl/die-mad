<template>
  <div id="treasure-menu" :class="{open: open}">
    <button class="med-button" @click="$emit('close')">CLOSE</button>
    <h2>DICE SKINS</h2>
    <div class="tabs">
      <div
      class="tab"
      v-for="(skin, rarity) in settings.skins"
      :key="rarity"
      :class="[{selected: selectedDieTab === rarity}, rarity]"
      @click="selectedDieTab = rarity">
        <div>{{ titlize(rarity) }}</div>
        <div>{{ unlockedDieCount(rarity) }}</div>
      </div>
    </div>
    <div class="section dice-skins" :class="selectedDieTab + '-tab'">
      <div v-if="open">
        <div class="skins-list">
          <div
          v-for="(skin, i) in filterList(settings.skins[selectedDieTab])"
          :key="i"
          class="choice"
          @click="pickDieSkin(skin.class)"
          :class="{selected: settings.currentDiceSkin === skin.class}"
          :style="{letterSpacing: skin.class === 'pattern genderfluid' ? '-1.6px' : '', fontSize: skin.class === 'pattern genderfluid' ? '15px' : ''}">
            <div class="die d20" :class="[skin.class, moonPhase(skin.class)]">
              <div class="skin"></div>
              <span>20</span>
            </div>
            <span style="font-weight: 500">{{ skin.name }}</span>
          </div>
          <p v-if="dieCategoryIsEmpty(selectedDieTab)">
            {{ titlize(selectedDieTab) }} dice you unlock will be displayed here. You can unlock dice by completing achievements. Check out the achievements section of this menu!
          </p>
        </div>
        <div class="skins-list">
          <div
          class="choice"
          @click="pickDieSkin('random')"
          :class="{selected: settings.currentDiceSkin === 'random'}">
            <div class="die d20" :class="currentRandomSkin">
              <div class="skin"></div>
              <span style="left: calc(50% - 12px)">??</span>
            </div>
            <span style="font-weight: 500">Random</span>
          </div>
        </div>
        <!-- for testing purposes only: -->
        <!-- <button class="med-button" @click="awardRandomDie">GIMME</button> -->
      </div>
    </div>
    <h2>TABLE THEMES</h2>
    <span class="subheader">More coming soon!</span>
    <div class="section table-themes">
      <div
      v-for="(theme, i) in filterList(settings.tableThemes)"
      :key="i"
      class="choice"
      @click="pickTableTheme(theme.class)"
      :class="{selected: settings.currentTableTheme === theme.class}">
        <div
        class="table-theme"
        :class="theme.class">
        </div>
        <span style="font-weight: 500">{{ theme.name }}</span>
      </div>
    </div>
    <h2>ANIMATIONS</h2>
    <span class="subheader">More coming soon!</span>
    <div class="tabs">
      <div
      class="tab"
      v-for="(tab, name) in settings.critAnimations"
      :key="name"
      :class="{selected: selectedAnimationTab === name}"
      @click="selectedAnimationTab = name">
        <div>{{ titlize(name) }}</div>
        <div>{{ unlockedAnimationCount(name) }}</div>
      </div>
    </div>
    <div class="section animations" :class="selectedAnimationTab + '-tab'">
      <div
      v-for="(animation, i) in filterList(settings.critAnimations[selectedAnimationTab])"
      :key="i"
      class="choice"
      @click="pickAnimation(animation.class)"
      :class="{selected: settings.currentCritAnimations[selectedAnimationTab] === animation.class}">
        <crit-animation :type="animation.class" />
        <span style="font-weight: 500">{{ animation.name }}</span>
      </div>
    </div>
    <h2>ACHIEVEMENTS</h2>
    <div class="section achievements">
      <div
      class="cheevo"
      v-for="(cheevo, i) in achievements"
      :key="i"
      :style="{display: cheevo.secret && !cheevo.got ? 'none' : ''}"
      :class="cheevo.rarity || cheevo.reward">
        <h3>{{ cheevo.name }}</h3>
        <span v-if="cheevo.got">{{ cheevo.description }}</span>
        <span v-if="!cheevo.got" style="font-size: 38px">? ? ?</span>
        <span class="big-check" v-if="cheevo.got">&#10003;</span>
      </div>
    </div>
  </div>
</template>

<script>
import CritAnimation from '@/components/CritAnimation.vue';

import settings from '@/services/settings.js';
import { rollAchievements } from '@/services/cheevos.js';
import utils from '@/services/utils.js';

export default {
  name: 'TreasureMenu',
  components: { CritAnimation },
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      settings,
      currentRandomSkin: 'default pink',
      selectedDieTab: 'basic',
      selectedAnimationTab: 'success'
    }
  },
  computed: {
    achievements () {
      return rollAchievements;
    }
  },
  methods: {
    filterList (list) {
      let result = [];

      for (let i in list) {
        if (list[i].got) result.push(list[i]);
      }

      return result;
    },
    pickDieSkin (color) {
      settings.currentDiceSkin = color;
      utils.saveProgress();
    },
    pickTableTheme (theme) {
      settings.currentTableTheme = theme;
      utils.saveProgress();
    },
    pickAnimation (animation) {
      settings.currentCritAnimations[this.selectedAnimationTab] = animation;
      utils.saveProgress();
    },
    titlize (str) {
      return utils.titlize(str);
    },
    dieCategoryIsEmpty (category) {
      for (var i = 0; i < settings.skins[category].length; i++) {
        if (settings.skins[category][i].got) return false;
      }

      return true;
    },
    awardRandomDie (rarity) {
      settings.awardRandomDie(rarity);
    },
    unlockedDieCount (rarity) {
      let owned = 0;

      for (var i = 0; i < settings.skins[rarity].length; i++) {
        if (settings.skins[rarity][i].got) owned++;
      }

      return owned + '/' + settings.skins[rarity].length;
    },
    unlockedAnimationCount (type) {
      let owned = 0;

      for (var i = 0; i < settings.critAnimations[type].length; i++) {
        if (settings.critAnimations[type][i].got) owned++;
      }

      return owned + '/' + settings.critAnimations[type].length;
    },
    moonPhase (skin) {
      if (skin === 'animated moon') {
        return utils.calculateMoonPhase();
      } else {
        return '';
      }
    }
  },
  mounted() {
    var that = this; // i hate doing this...
    var cycleSkins = function () {
      setTimeout(() => {
        that.currentRandomSkin = settings.getRandomDieSkin();
        cycleSkins();
      }, 800);
    }

    cycleSkins();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

#treasure-menu {
  position: absolute;
  top: 100vh;
  left: 0;
  width: 100vw;
  height: calc(100vh + 200px);
  padding: 60px 10px;

  color: #FFF;

  background-color: #333;

  transition: top 0.3s cubic-bezier(0, 0.25, 0.6, 1.5);

  z-index: 75;

  &.open {
    top: 0vh;
    overflow-x: hidden;
    height: 100vh;
    transition: top 0.3s cubic-bezier(0, 0.25, 0.6, 1.5), height 0s 0.3s linear;
  }
}

.section {
  margin: 0 auto;
  padding: 20px 2px;
  max-width: 600px;
  border-radius: 8px;

  background-color: #222;

  &.basic-tab, &.success-tab {
    border-top-left-radius: 0;
  }

  &.mythic-tab, &.explosion-tab {
    border-top-right-radius: 0;
  }

  p {
    margin: 0;
    padding: 16px;
  }
}

.subheader {
  display: block;
  margin-top: -16px;
  margin-bottom: 16px;

  color: #999;
}

.tabs {
  max-width: 600px;
  margin: 0 auto;

  display: flex;
  flex-direction: row;

  .tab {
    min-height: 50px;
    cursor: pointer;
    padding: 8px 2px;
    padding-bottom: 4px;
    margin-bottom: 4px;

    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    flex: 1;

    background-color: #222;
    background-image: linear-gradient(to bottom, #1A1A1A, #222);

    &:not(:last-child) {
      margin-right: 4px;
    }

    &.selected {
      padding-bottom: 8px;
      margin-bottom: 0;
    }
  }
}

.section.dice-skins {
  min-height: 220px;
}

.skins-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;

  .choice {
    position: relative;
    border: 3px solid transparent;
    border-radius: 5px;
    cursor: pointer;

    &.selected {
      border-color: $red;
    }

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

.section.table-themes {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;

  .choice {
    padding: 8px 8px 8px 38px;
    margin: 10px 6px;
    max-width: calc(50% - 12px);
    border: 3px solid transparent;
    border-radius: 5px;
    cursor: pointer;

    &.selected {
      border-color: $red;
    }

    span {
      margin-left: -30px;
    }

    .table-theme {
      margin-bottom: 4px;
      border: 1px solid #000;
      position: relative;
      width: 30vw;
      max-width: 100%;
      height: 30vh;

      &::before {
        padding-left: 30px;
        left: -31px;
        box-shadow: none;
      }

      &::after {
        display: none;
      }
    }
  }

  @media only screen and (max-width: 800px) {
    .choice {
      padding: 8px;

      span {
        margin-left: 0;
      }

      .table-theme {
        width: 40vw;

        &::before {
          display: none;
        }
      }
    }
  }
}

.section.animations {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;

  .choice {
    position: relative;
    border: 3px solid transparent;
    border-radius: 5px;
    cursor: pointer;

    &.selected {
      border-color: $red;
    }
  }

  .animation {
    position: relative;
    display: flex;
  }
}

.section.achievements {
  max-width: 1080px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;

  .cheevo {
    position: relative;
    padding: 10px;
    padding-right: 50px;
    margin: 8px;
    width: 300px;
    height: 95px;

    border: 2px solid;
    border-radius: 8px;

    background-color: #222;

    color: #FFF;

    h2, h3 {
      margin: 0;
    }

    h2 {
      color: $red;
      font-style: italic;
    }

    .big-check {
      position: absolute;
      top: 0;
      right: -20px;
      height: 100%;

      font-size: 100px;
      color: $red;
      line-height: 95px;
      text-shadow: #222 4px 4px 8px;
    }
  }
}

</style>
