<template>
  <div id="menu-screen" :class="{open: open}">
    <button class="med-button" @click="closeMenu">{{ settings.cookiesEnabled ? 'SAVE SETTINGS' : 'CLOSE' }}</button>
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
      <label @click.prevent="toggleCookiesEnabled" class="checkbox-container">
        <span>Save progress and settings</span>
        <input type="checkbox" v-model="settings.cookiesEnabled" :disabled="!canSaveCookies" />
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
              <input type="number" step="1" @input.prevent="fixScrollBug" v-model="settings.diceRack.custom.sides" />
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
    <h2>CREDITS</h2>
    <div class="section credits">
      <span class="bigish-text red">
        Vanessa made this!
      </span>
      <img src="@/assets/me.jpg" />
      <span class="subheader">"You touched my dice, now ur gay."</span>
      <p>
        Some icons are from <a href="https://thenounproject.com/">The Noun Project</a> and I paid real money for them. Others are made by me. This whole thing was built using <a href="https://vuejs.org/">Vue.js</a>. If you have bugs to report or features to suggest check out the <a href="https://github.com/vajazzercise/roll-them-bones">GitHub for this project</a> and opening an issue. That's also where you can view the full source code for this project (although, I'm super new to Vue.js so maybe it's not the best example.)
      </p>
      <p>
        If this project makes you happy, you can make me happy by supporting my other projects: Making board games with my friends at...
        <a href="http://gamesforspiders.com"><img src="@/assets/gfs_logo.png" /></a>
        Follow us on <a href="https://twitter.com/gamesforspiders">Twitter</a>, <a href="https://www.facebook.com/gamesforspiders">Facebook</a>, or <a href="https://www.instagram.com/games4spiders/">Instagram</a>.
      </p>
    </div>
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
      canSaveCookies: utils.canSaveCookies()
    }
  },
  methods: {
    closeMenu () {
      if (settings.cookiesEnabled) utils.saveProgress();
      this.$emit('close');
    },
    fixScrollBug () {
      setTimeout(() => {
        let to = document.getElementsByTagName('body')[0].scrollTop;

        document.getElementById('menu-screen').scrollTop += to;
        document.getElementsByTagName('body')[0].scrollTop = 0;
      }, 1);
    },
    titlize (str) {
      return utils.titlize(str);
    },
    toggleCookiesEnabled () {
      settings.toggleCookiesEnabled();
    },
    toggleAllDiceSetting (attr) {
      settings.toggleAllDiceSetting(attr);
    }
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

  p {
    margin: 0;
    padding: 16px;
  }
}

.general-settings, .credits {
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

.bigish-text {
  font-size: 22px;
}
</style>
