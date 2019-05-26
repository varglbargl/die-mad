<template>
  <main id="app">
    <div id="tabletop">
      <DX
      v-for="(die, i) in activeDice"
      :key="die.id"
      :sides="die.sides"
      :skin="settings.currentDiceSkin"
      v-model="rolls[i]"
      @kill="deleteDie(i)"
      @explode="explodeDie($event)"
      @crit="animateCrit($event)"
      ref="dice" />

      <DX
      v-for="(eDie, eI) in bonusDice"
      :key="eDie.id"
      :sides="eDie.sides"
      skin="default fire"
      v-model="bonusRolls[eI]"
      @kill="deleteBonusDie(eI)"
      @explode="explodeDie($event)"
      @crit="animateCrit($event)"
      ref="explodedDice" />

      <crit-animation
      v-for="(crit, cI) in critRolls"
      @kill="removeCritAnimation(cI)"
      :key="crit.id"
      :x="crit.x"
      :y="crit.y" />
    </div>
    <div class="total">
      {{ rolledDiceList }}<span v-if="totalRolled !== 0"> = {{ totalRolled }}</span>
    </div>
    <div class="dice-rack">
      <div
      v-for="(die, i) in settings.diceRack"
      :key="i"
      @touchstart.prevent="createDie(die.sides, $event)"
      @touchend.prevent="dropNewDie"
      @mousedown.prevent="createDie(die.sides, $event)"
      @mouseup.prevent="dropNewDie"
      class="die"
      :class="[dieType(die.sides), settings.currentDiceSkin]"
      :style="{display: die.active ? 'flex' : 'none'}">
        <div class="skin" :class="settings.currentDiceSkin"></div>
        <span :style="{fontSize: Math.min(32 - totalActiveDice * 2, 20) + 'px'}">
          D{{ die.sides }}
        </span>
      </div>
    </div>
    <div class="cancel-box">
      <div :class="[{open: touched !== null}, 'cancel-panel']">
        <img src="@/assets/cancel.svg" />
      </div>
    </div>
    <button @click="rollAll">ROLL ALL</button>
    <button @click="clear">CLEAR</button>
    <button @click="settingsOpen = true">SETTINGS</button>
    <settings-menu @close="settingsOpen = false" :open="settingsOpen" />
  </main>
</template>

<script>
import Vue from 'vue';
import DX from '@/components/DX.vue';
import SettingsMenu from '@/components/SettingsMenu.vue';
import CritAnimation from '@/components/CritAnimation.vue';
import settings from '@/services/settings.js';
import utils from '@/services/utils.js';

export default {
  name: 'app',
  components: { DX, SettingsMenu, CritAnimation },
  data () {
    return {
      activeDice: [],
      bonusDice: [],
      rolls: [],
      bonusRolls: [],
      critRolls: [],
      touched: null,
      count: 0,
      settings: settings,
      settingsOpen: false
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
    }
  },
  methods: {
    rollAll () {
      if (!this.$refs.dice) return;

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
      this.activeDice.push({sides, id: ++this.count});

      Vue.nextTick(() => { // because the actual die component doesn't exist yet
        this.touched = this.$refs.dice[this.activeDice.length - 1];

        if (evt.changedTouches) {
          this.touched.x = evt.changedTouches[0].target.offsetLeft;
          this.touched.y = evt.changedTouches[0].target.offsetTop;

        } else if (evt.target.offsetLeft !== undefined && evt.target.offsetTop !== undefined) {
          this.touched.x = evt.target.offsetLeft;
          this.touched.y = evt.target.offsetTop;
        }

        this.$refs.dice[this.activeDice.length - 1].dragStart(evt);
      });
    },
    dropNewDie () {
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
      this.rolls = [];
      this.bonusDice = [];
      this.bonusRolls = [];
    },
    deviceMotionHandler (e) {
      if (!settings.shakeToRoll) return;

      if (e.acceleration) {
        let shakeSpeed = Math.max(Math.abs(e.acceleration.x), Math.abs(e.acceleration.y), Math.abs(e.acceleration.z));
        if (shakeSpeed > 20) {
          this.rollAll();
        }
      }
    },
    animateCrit (evt) {
      this.critRolls.push({x: evt[0], y: evt[1], id: ++this.count});
    },
    removeCritAnimation (i) {
      this.critRolls.splice(i, 1);
    },
    explodeDie(evt) {
      this.bonusDice.push({sides: evt[0], id: ++this.count});

      Vue.nextTick(() => {
        this.$refs.explodedDice[this.bonusDice.length - 1].x = evt[1];
        this.$refs.explodedDice[this.bonusDice.length - 1].y = evt[2];
        this.$refs.explodedDice[this.bonusDice.length - 1].throwDieRandomly();
      });
    }
  },
  mounted () {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.deviceMotionHandler, true);
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/dice.scss";
@import "@/styles/diceSkins.scss";

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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#tabletop {
  width: 100vw;
  height: calc(80vh - #{$menu-height});

  background-color: $felt-green;
  overflow: show;
}

.dice-rack {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  height: 70px;
  overflow: hidden;

  .die {
    position: relative;
    margin: 2px;
    flex-shrink: 1;
  }
}

.total {
  position: relative;
  margin-top: -24px;
  height: 24px;
  pointer-events: none;

  background-color: rgba(0, 0, 0, 0.3);

  font-size: 18px;
  font-weight: 800;
  color: #FFF;
}

.cancel-box {
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

    background-color: #FFF;

    transition: top 0.08s linear;

    &.open {
      top: 0%;
    }

    img {
      height: 70px;
    }
  }
}

span.red {
  color: $red;
}
</style>
