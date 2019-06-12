<template>
  <div id="menu-screen" :class="{open: open}">
    <button class="med-button" @click="$emit('close')">CLOSE</button>
    <h2>DICE SKINS</h2>
    <div class="tabs">
      <div
      class="tab"
      v-for="(skins, rarity) in settings.skins"
      :key="rarity"
      :class="[{selected: selectedDieTab === rarity}, rarity]"
      @click="selectedDieTab = rarity">
        <div>{{ titlize(rarity) }}</div>
        <div>{{ unlockedCount(rarity) }}</div>
      </div>
    </div>
    <div class="section dice-skins" :class="selectedDieTab + '-tab'">
      <div v-if="open">
        <div class="skins-list">
          <div
          v-for="(skin, i) in settings.skins[selectedDieTab]"
          :key="i"
          class="choice"
          @click="pickDieSkin(skin.class)"
          :class="{selected: settings.currentDiceSkin === skin.class}"
          :style="{display: skin.has ? '' : 'none', letterSpacing: skin.class === 'pattern genderfluid' ? '-1.6px' : '', fontSize: skin.class === 'pattern genderfluid' ? '15px' : ''}">
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
        <span v-if="!cheevo.got" style="font-weight: 800">? ? ?</span>
        <span class="big-check" v-if="cheevo.got">&#10003;</span>
      </div>
    </div>
  </div>
</template>

<script>
import settings from '@/services/settings.js';
import { rollAchievements } from '@/services/cheevos.js';
import utils from '@/services/utils.js';

export default {
  name: 'DiceMenu',
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      settings: settings,
      currentRandomSkin: 'default pink',
      selectedDieTab: 'basic'
    }
  },
  computed: {
    achievements () {
      return rollAchievements;
    }
  },
  methods: {
    pickDieSkin (color) {
      settings.currentDiceSkin = color;
      utils.saveProgress();
    },
    titlize (str) {
      return utils.titlize(str);
    },
    dieCategoryIsEmpty (category) {
      for (var i = 0; i < settings.skins[category].length; i++) {
        if (settings.skins[category][i].has) return false;
      }

      return true;
    },
    awardRandomDie (rarity) {
      settings.awardRandomDie(rarity);
    },
    unlockedCount (rarity) {
      let owned = 0;

      for (var i = 0; i < settings.skins[rarity].length; i++) {
        if (settings.skins[rarity][i].has) owned++;
      }

      return owned + '/' + settings.skins[rarity].length;
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

#menu-screen {
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

  &.basic-tab {
    border-top-left-radius: 0;
  }

  &.mythic-tab {
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
    cursor: pointer;
    padding: 8px 2px;
    padding-bottom: 4px;
    margin-bottom: 4px;

    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    flex: 1;

    background-color: #222;

    &:not(:last-child) {
      margin-right: 4px;
    }

    &.selected {
      padding-bottom: 8px;
      margin-bottom: 0;
    }
  }
}

.dice-skins {
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

.achievements {
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
