<template>
  <main id="app">
    <div id="intro-screen" v-if="!introPlayed" :class="{open: introPlaying}">
      <img src="@/assets/logo.svg" />
      <button class="big-button" @click="playIntro($event)">{{ playButtonText }}</button>
    </div>
    <achievements ref="cheevos"/>
    <div id="tabletop" :class="settings.currentTableTheme">
      <DX
      v-for="(die, i) in activeDice"
      :key="die.id"
      :sides="die.sides"
      :skin="die.skin ? die.skin : settings.currentDiceSkin"
      v-model="rolls[i]"
      @kill="deleteDie(i)"
      @explode="explodeDie($event)"
      @crit="animateCrit($event)"
      ref="dice" />

      <DX
      v-for="(eDie, eI) in bonusDice"
      :key="eDie.id"
      :sides="eDie.sides"
      skin="neon explosion"
      v-model="bonusRolls[eI]"
      @kill="deleteBonusDie(eI)"
      @explode="explodeDie($event)"
      @crit="animateCrit($event)"
      ref="explodedDice" />

      <crit-animation
      v-for="(crit, cI) in critRolls"
      @kill="removeCritAnimation(cI)"
      :type="crit.class"
      :key="crit.id"
      :x="crit.x"
      :y="crit.y" />
    </div>
    <div class="total">
      <div class="total-text">
        <span class="equasion">{{ rolledDiceList }}</span>
        <span class="equals" v-if="totalRolled !== 0">&nbsp;= {{ totalRolled }}</span>
      </div>
    </div>
    <div id="dice-rack">
      <div
      v-for="(die, i) in settings.diceRack"
      :key="i"
      @touchstart.prevent="createDie(die.sides, $event)"
      @touchend.prevent="dropNewDie"
      @mousedown.prevent="createDie(die.sides, $event)"
      @mouseup.prevent="dropNewDie"
      class="die"
      :class="[
        dieType(die.sides),
        settings.currentDiceSkin === 'random' ?
        settings.getRandomDieSkin(die.sides) :
        settings.currentDiceSkin,
        moonPhase
      ]"
      :style="{display: die.active ? 'flex' : 'none', animationDelay: '-' + die.sides * 7 + 's'}">
        <div class="skin"></div>
        <span :style="{fontSize: Math.min(32 - totalActiveDice * 2, 20) + 'px'}">
          D{{ die.sides }}
        </span>
      </div>
    </div>
    <div id="cancel-box">
      <div :class="[{open: touched !== null}, 'cancel-panel']">
        <img src="@/assets/cancel.svg" />
      </div>
    </div>
    <div id="menu-bar">
      <div class="button" @click="rollAll">
        <img src="@/assets/roll.svg" />
        <span>ROLL</span>
      </div>
      <div class="button" @click="clear">
        <img src="@/assets/trash.svg" />
        <span>CLEAR</span>
      </div>
      <div class="button" @click="treasureOpen = true">
        <img src="@/assets/die.svg" />
        <span>TREASURE</span>
      </div>
      <div class="button" @click="settingsOpen = true">
        <img src="@/assets/cog.svg" />
        <span>SETTINGS</span>
      </div>
    </div>
    <settings-menu @close="settingsOpen = false" :open="settingsOpen" />
    <treasure-menu @close="treasureOpen = false" :open="treasureOpen" />
  </main>
</template>

<script>
import Vue from 'vue';
import DX from '@/components/DX.vue';
import SettingsMenu from '@/components/SettingsMenu.vue';
import TreasureMenu from '@/components/TreasureMenu.vue';
import CritAnimation from '@/components/CritAnimation.vue';
import Achievements from '@/components/Achievements.vue';

import { resetRollTracking, setDieOnTheTable } from '@/services/cheevos.js';
import settings from '@/services/settings.js';
import utils from '@/services/utils.js';

export default {
  name: 'app',
  components: { DX, SettingsMenu, TreasureMenu, CritAnimation, Achievements },
  data () {
    return {
      settings,
      activeDice: [],
      bonusDice: [],
      rolls: [],
      bonusRolls: [],
      critRolls: [],
      touched: null,
      count: 0,
      treasureOpen: false,
      settingsOpen: false,
      introPlaying: false,
      introPlayed: false,
      playButtonText: 'LET\'S ROLL',
      lastRolled: 0
    }
  },
  computed: {
    totalRolled () {
      var total = 0;

      for (let i = 0; i < this.rolls.length; i++) {
        if (this.rolls[i]) total += this.rolls[i];
      }

      for (let i = 0; i < this.bonusRolls.length; i++) {
        if (this.bonusRolls[i]) total += this.bonusRolls[i];
      }

      return total;
    },
    rolledDiceList () {
      var diceCounts = {};

      for (let i = 0; i < this.activeDice.length; i++) {
        if (diceCounts[this.activeDice[i].sides]) {
          diceCounts[this.activeDice[i].sides]++;

        } else {
          diceCounts[this.activeDice[i].sides] = 1;
        }
      }

      var diceTypes = Object.keys(diceCounts).sort((a, b) => {
        return parseInt(a) > parseInt(b) ? 1 : -1;
      });

      var result = [];

      for (var i = 0; i < diceTypes.length; i++) {
        result.push(diceCounts[diceTypes[i]] + 'D' + diceTypes[i]);
      }

      return result.join('+');
    },
    totalActiveDice () {
      var total = 0;

      for (let i in settings.diceRack) {
        if (settings.diceRack[i].active) {
          total++;
        }
      }

      return total;
    },
    moonPhase () {
      if (settings.currentDiceSkin === 'animated moon') {
        return utils.calculateMoonPhase();
      } else {
        return '';
      }
    }
  },
  methods: {
    playIntro (clickEvent) {
      this.animateCrit([
        'success',
        clickEvent.clientX - 30 - document.getElementById('tabletop').offsetLeft,
        clickEvent.clientY - 30 - document.getElementById('tabletop').offsetTop
      ]);

      this.introPlaying = true;

      setTimeout(() => {
         this.introPlaying = false;
         this.introPlayed = true;
      }, 2000);
    },
    rollAll () {
      if (!this.$refs.dice) return;
      resetRollTracking();

      this.rolls = [];
      this.bonusDice = [];
      this.bonusRolls = [];

      for (let i = 0; i < this.$refs.dice.length; i++) {
        this.$refs.dice[i].throwDieRandomly();
      }
    },
    dieType (sides) {
      return utils.getDieType(sides);
    },
    createDie (sides, evt) {
      if (settings.currentDiceSkin === 'random') {
        this.activeDice.push({sides, id: ++this.count, skin: settings.getRandomDieSkin()});
      } else {
        this.activeDice.push({sides, id: ++this.count, skin: settings.currentDiceSkin});
      }

      setDieOnTheTable(this.activeDice);

      Vue.nextTick(() => { // because the actual die component doesn't exist yet
        this.touched = this.$refs.dice[this.activeDice.length - 1];

        if (evt.changedTouches) {
          this.touched.x = evt.changedTouches[0].target.offsetLeft - document.getElementById('tabletop').offsetLeft;
          this.touched.y = evt.changedTouches[0].target.offsetTop - document.getElementById('tabletop').offsetTop;

        } else if (evt.target.offsetLeft !== undefined && evt.target.offsetTop !== undefined) {
          this.touched.x = evt.target.offsetLeft - document.getElementById('tabletop').offsetLeft;
          this.touched.y = evt.target.offsetTop - document.getElementById('tabletop').offsetTop;
        }

        this.$refs.dice[this.activeDice.length - 1].dragStart(evt);
      });
    },
    dropNewDie () {
      if (!this.touched) return;

      this.touched.dragStop();
      this.touched = null;
    },
    deleteDie (i) {
      this.activeDice.splice(i, 1);
      this.rolls.splice(i, 1);
    },
    deleteBonusDie (i) {
      this.bonusDice.splice(i, 1);
      this.bonusRolls.splice(i, 1);
    },
    clear () {
      this.activeDice = [];
      setDieOnTheTable([]);
      this.rolls = [];
      this.bonusDice = [];
      this.bonusRolls = [];
      this.count = 0;
      this.$refs.cheevos.dismissAllAchievements();
    },
    deviceMotionHandler (e) {
      if (!settings.shakeToRoll) return;

      let now = new Date().getTime();
      if (!settings.animationsEnabled && now - 700 < this.lastRolled) return;

      if (e.acceleration) {
        let shakeSpeed = Math.max(Math.abs(e.acceleration.x), Math.abs(e.acceleration.y), Math.abs(e.acceleration.z));

        if (shakeSpeed > 20) {
          this.rollAll();
          this.lastRolled = now;
          // timesShakenWithoutLanding++;
        }
      }
    },
    animateCrit (evt) {
      this.critRolls.push({class: settings.currentCritAnimations[evt[0]], x: evt[1], y: evt[2], id: ++this.count});
    },
    removeCritAnimation (i) {
      this.critRolls.splice(i, 1);
    },
    explodeDie(evt) {
      this.bonusDice.push({sides: evt[0], id: ++this.count});
      this.critRolls.push({class: settings.currentCritAnimations.explosion, x: evt[1], y: evt[2], id: ++this.count});

      Vue.nextTick(() => {
        this.$refs.explodedDice[this.bonusDice.length - 1].x = evt[1];
        this.$refs.explodedDice[this.bonusDice.length - 1].y = evt[2];
        this.$refs.explodedDice[this.bonusDice.length - 1].throwDieRandomly();
      });
    }
  },
  mounted () {
    utils.loadSave();

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.deviceMotionHandler, true);
    }

    let funGoofs = ['i\'m mad', 'let\'s die', 'send dice pics', 'let\'s roll', 'like a katamari', 'cybergeomancy', 'roll \'em bones'];

    if (settings.cookiesEnabled) this.playButtonText = utils.getRandom(funGoofs).toUpperCase();
  },
  watch: {
    'settings.currentTableTheme' () {} // unclear why i have to do this for table themes but not dice skins
  }
}
</script>

<style lang="scss">
@import "@/styles/dice.scss";
@import "@/styles/diceSkins.scss";
@import "@/styles/tableThemes.scss";

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

#app {
  height: 100vh;

  display: flex;
  flex-direction: column;

  background-color: #000;

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#intro-screen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: #000;

  transition: top 2s cubic-bezier(0.5, 0, 0.5, 1);

  z-index: 100;

  &.open {
    top: -100vh;
  }

  img {
    max-width: 80%;
    max-height: 50%;
    margin-top: -10%;
  }
}

#tabletop {
  position: relative;
  width: 100vw;
  max-width: 800px;
  margin: 0 auto;
  overflow: show;

  flex: 1;

  background-color: #444;
}

#dice-rack {
  height: $menu-height;
  overflow: hidden;
  padding: 5px 0;
  border-top: 1px solid #111;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: #222;

  .die {
    position: relative;
    margin: 2px;
    flex-shrink: 1;

    span {
      @media only screen and (min-width: 500px) {
        font-size: 20px !important;
      }
    }
  }
}

#menu-bar {
  width: 100%;
  height: $menu-height;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #222;

  .button {
    height: 100%;
    border-top: 1px solid #111;
    cursor: pointer;

    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    color: #FFF;

    font-size: 14px;
    font-weight: 500;

    img {
      height: 45px;
    }

    &:not(:last-child) {
      border-right: 1px solid #111;
    }
  }
}

.total {
  position: relative;
  margin-top: -24px;
  padding: 0 4px;
  height: 24px;
  pointer-events: none;

  background-color: rgba(0, 0, 0, 0.4);

  font-size: 18px;
  font-weight: 800;
  color: #FFF;

  .total-text {
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-end;
    max-width: 100%;

    .equasion {
      flex-shrink: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .equals {
      flex-shrink: 0;
    }
  }
}

#cancel-box {
  width: 100%;
  height: 70px;
  margin-top: -70px;
  position: relative;

  pointer-events: none;

  overflow: hidden;

  .cancel-panel {
    position: absolute;
    width: 100%;
    height: 70px;
    top: 100%;

    background-color: #222;

    transition: top 0.08s linear;

    &.open {
      top: 1px;
    }

    img {
      height: 100%;
    }
  }
}

.big-button {
  padding: 10px 15px;
  margin: 50px 10px 10px 10px;
  border: 5px solid $red;
  border-radius: 15px;
  outline: none;

  background-color: #000;

  font-size: 30px;
  font-weight: 800;
  color: $red;
  font-style: italic;
  white-space: nowrap;

  &:hover {
    margin: 48px 11px 12px 9px;
    box-shadow: 4px 8px rgba(0,0,0,0.3);
  }

  &:active {
    margin: 52px 9px 8px 11px;
    box-shadow: none;
  }
}

.med-button {
  @extend .big-button;

  padding: 5px 10px;
  margin: 10px;
  border: 3px solid $red;

  font-size: 20px;

  &:hover {
    margin: 8px 11px 12px 9px;
  }

  &:active {
    margin: 12px 9px 8px 11px;
  }
}

span.red {
  color: $red;
}

span.blue {
  color: $blue;
}

a {
  color: $blue;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.basic {
  border-color: #282 !important;
  background-color: $basic !important;
  background-image: linear-gradient(to bottom, $basic, #222) !important;
}

.rare {
  border-color: #35B !important;
  background-color: $rare !important;
  background-image: linear-gradient(to bottom, $rare, #222) !important;
}

.epic {
  border-color: #72A !important;
  background-color: $epic !important;
  background-image: linear-gradient(to bottom, $epic, #222) !important;
}

.mythic {
  border-color: #B83 !important;
  background-color: $mythic !important;
  background-image: linear-gradient(to bottom, $mythic, #222) !important;
}

</style>
