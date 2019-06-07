<template>
  <div id="menu-screen" :class="{open: open}" @input.prevent="fixScrollBug">
    <button class="med-button" @click="$emit('close')">CLOSE SETTINGS</button>
    <h2>GENERAL SETTINGS</h2>
    <div class="general-settings section">
      <label class="checkbox-container">
        <span>Shake device to roll dice</span>
        <input type="checkbox" v-model="settings.shakeToRoll" />
        <span class="checkmark"></span>
      </label>
      <label class="checkbox-container">
        <span :class="{disabled: !canVibrate}">Haptic feedback <span class="red">(BETA)</span></span>
        <input type="checkbox" v-model="settings.vibrateOnCollision" :disabled="!canVibrate" />
        <span class="checkmark"></span>
      </label>
      <label class="checkbox-container">
        <span>Enable rolling animations</span>
        <input type="checkbox" v-model="settings.animationsEnabled" />
        <span class="checkmark"></span>
      </label>
    </div>
    <h2>DICE SETTINGS</h2>
    <table class="dice-settings section">
      <thead>
        <tr>
          <th></th>
          <th>Use</th>
          <th>Critical Hit</th>
          <th>Critical Fail</th>
          <th>Explode</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ALL</td>
          <td @click.prevent="toggleAllDiceSetting('active')">
            <label class="checkbox-container inline">
              <input type="checkbox" v-model="settings.allDice.active" />
              <span class="checkmark"></span>
            </label>
          </td>
          <td @click.prevent="toggleAllDiceSetting('critSuccess')">
            <label class="checkbox-container inline">
              <input type="checkbox" v-model="settings.allDice.critSuccess" />
              <span class="checkmark"></span>
            </label>
          </td>
          <td @click.prevent="toggleAllDiceSetting('critFail')">
            <label class="checkbox-container inline">
              <input type="checkbox" v-model="settings.allDice.critFail" />
              <span class="checkmark"></span>
            </label>
          </td>
          <td @click.prevent="toggleAllDiceSetting('exploding')">
            <label class="checkbox-container inline">
              <input type="checkbox" v-model="settings.allDice.exploding" />
              <span class="checkmark"></span>
            </label>
          </td>
        </tr>
        <tr v-for="(die, name) in settings.diceRack" :key="name">
          <td v-if="name != 'custom'">
            {{ name }}
          </td>
          <td v-if="name === 'custom'">
            <label class="checkbox-container inline">
              D
              <input type="number" min="1" max="1000" step="1" v-model="settings.diceRack.custom.sides" />
            </label>
          </td>
          <td>
            <label class="checkbox-container inline">
              <input type="checkbox" v-model="die.active" />
              <span class="checkmark"></span>
            </label>
          </td>
          <td>
            <label class="checkbox-container inline">
              <input type="checkbox" v-model="die.critSuccess" />
              <span class="checkmark"></span>
            </label>
          </td>
          <td>
            <label class="checkbox-container inline">
              <input type="checkbox" v-model="die.critFail" />
              <span class="checkmark"></span>
            </label>
          </td>
          <td>
            <label class="checkbox-container inline">
              <input type="checkbox" v-model="die.exploding" />
              <span class="checkmark"></span>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
    <h2>DICE SKINS</h2>
    <div class="tabs">
      <div
      class="tab"
      v-for="(skins, rarity) in settings.skins"
      :key="rarity"
      :class="{selected: selectedDieTab === rarity}"
      @click="selectedDieTab = rarity">
        {{ titlize(rarity) }}
      </div>
    </div>
    <div class="section">
      <div class="skins-list" v-if="open">
        <div
        v-for="(classes, name) in settings.skins[selectedDieTab]"
        :key="name"
        class="choice"
        @click="pickDieSkin(classes)"
        :class="{selected: settings.currentDiceSkin === classes}">
          <div class="die d20" :class="classes">
            <div class="skin"></div>
            <span>20</span>
          </div>
          <span style="font-weight: 500">{{ titlize(name) }}</span>
        </div>
      </div>
      <div class="skins-list">
        <div
        class="choice"
        @click="pickDieSkin('random')"
        :class="{selected: settings.currentDiceSkin === 'random'}">
          <div class="die d20" :class="currentRandomSkin">
            <div class="skin"></div>
            <span>??</span>
          </div>
          <span style="font-weight: 500">Random</span>
        </div>
      </div>
    </div>
    <div class="credits" v-if="showingCredits">
      <h2>CREDITS</h2>
      <div class="section">
        <span class="bigish-text red">
          Vanessa made this!
        </span>
        <img src="@/assets/me.jpg" />
        <span class="subheader">"You touched my dice, now ur gay."</span>
        <p>
          Some icons are from <a href="https://thenounproject.com/">The Noun Project</a> and I paid real money for them. Others are made by me. This whole thing was built using <a href="https://vuejs.org/">Vue.js</a>. If you have bugs to report or features to suggest check out the <a href="https://github.com/vajazzercise/roll-them-bones">GitHub for this project</a> and opening an issue. That's also where you can view the full source code for this project!
        </p>
        <p>
          If this project makes you happy, you can make me happy by supporting my other projects: Making board games with my friends at...
          <a href="http://gamesforspiders.com"><img src="@/assets/gfs_logo.png" /></a>
          Follow us on <a href="https://twitter.com/gamesforspiders">Twitter</a>, <a href="https://www.facebook.com/gamesforspiders">Facebook</a>, or <a href="https://www.instagram.com/games4spiders/">Instagram</a>.
        </p>
      </div>
    </div>
    <button
    class="big-button"
    @click="showingCredits = !showingCredits">
      {{ showingCredits ? 'HIDE' : 'SHOW' }} CREDITS
    </button>
  </div>
</template>

<script>
import settings from '@/services/settings.js';
import utils from '@/services/utils.js';

export default {
  name: 'SettingsMenu',
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
      canVibrate: 'vibrate' in navigator,
      currentRandomSkin: 'default pink',
      showingCredits: false,
      selectedDieTab: 'basic'
    }
  },
  methods: {
    fixScrollBug () {
      setTimeout(() => {
        let to = document.getElementsByTagName('body')[0].scrollTop;

        document.getElementById('menu-screen').scrollTop = to;
        document.getElementsByTagName('body')[0].scrollTop = 0;
      }, 1);
    },
    pickDieSkin (color) {
      settings.currentDiceSkin = color;
    },
    titlize (str) {
      return utils.titlize(str);
    },
    toggleAllDiceSetting (attr) {
      settings.toggleAllDiceSetting(attr);
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
  },
  watch: {
    settings: {
      handler: function (/*newVal, oldVal*/) {
        let allSelected = {
          active: true,
          exploding: true,
          critSuccess: true,
          critFail: true
        };

        for (let i in settings.diceRack) {
          for (let attr in allSelected) {
            if (!settings.diceRack[i][attr]) {
              allSelected[attr] = false;
            }
          }
        }

        for (let attr in allSelected) {
          if (allSelected[attr]) {
            settings.allDice[attr] = true;
          } else {
            settings.allDice[attr] = false;
          }
        }
      },
      deep: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/styles/checkbox.scss";

#menu-screen {
  position: absolute;
  top: 100vh;
  left: 0;
  width: 100vw;
  height: calc(100vh + 100px);
  padding: 60px 10px 160px 10px;

  color: #FFF;

  background-color: #333;

  transition: top 0.3s cubic-bezier(0, 0.25, 0.6, 1.5);

  &.open {
    top: 0vh;
    overflow-x: hidden;
  }
}

.section {
  margin: 0 auto;
  padding: 10px 2px;
  max-width: 600px;

  background-color: #222;
}

.general-settings, .credits {
  p {
    padding: 16px;
  }

  img {
    display: block;
    margin: 18px auto;
    max-width: 80%;
  }
}

.dice-settings {
  width: 100%;
  table-layout: fixed;

  font-size: 22px;

  th {
    font-size: 18px;
  }

  input[type=number] {
    width: 55px;
    font-size: 18px;
    display: inline-block;
  }
}

.subheader {
  display: block;
  margin-top: -16px;
  margin-bottom: 16px;

  color: #999;
}

.disabled {
  opacity: 0.4;
}

.tabs {
  max-width: 600px;
  margin: 0 auto;

  display: flex;
  flex-direction: row;

  .tab {
    padding: 8px 2px;
    padding-bottom: 4px;
    margin-bottom: 4px;

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

.bigish-text {
  font-size: 22px;
}
</style>
