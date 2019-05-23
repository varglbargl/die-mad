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
      ref="dice" />
    </div>
    <div class="total">
      {{ rolledDiceList }}<span v-if="totalRolled !== 0"> = {{ totalRolled }}</span>
    </div>
    <div class="dice-rack">
      <div
      v-for="(die, i) in diceRack"
      :key="i"
      @touchstart.prevent="createDie(die, $event)"
      @touchend.prevent="dropNewDie"
      @mousedown.prevent="createDie(die, $event)"
      @mouseup.prevent="dropNewDie"
      class="die"
      :class="'d' + die">
        <div class="skin" :class="settings.currentDiceSkin"></div>
        <span>D{{ die }}</span>
      </div>
    </div>
    <div class="cancel-box">
      <div :class="[{open: anyTouched}, 'cancel-panel']">
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
import settings from '@/services/settings.js';

export default {
  name: 'app',
  components: { DX, SettingsMenu },
  data () {
    return {
      activeDice: [],
      diceRack: [20, 12, 10, 8, 6, 4],
      rolls: [],
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
    anyTouched () {
      if (this.touched) return true;

      if (this.$refs && this.$refs.dice) {
        for (var i = 0; i < this.$refs.dice.length; i++) {
          if (this.$refs.dice[i].dragging) return true;
        }
      }

      return false;
    }
  },
  methods: {
    rollAll () {
      if (!this.$refs.dice) return;

      this.rolls = [];

      for (let i = 0; i < this.$refs.dice.length; i++) {
        this.$refs.dice[i].throwDieRandomly();
      }
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
    clear () {
      this.activeDice = [];
      this.rolls = [];
    },
    deviceMotionHandler (e) {
      if (e.acceleration) {
        let shakeSpeed = Math.max(Math.abs(e.acceleration.x), Math.abs(e.acceleration.y), Math.abs(e.acceleration.z));
        if (shakeSpeed > 20) {
          this.rollAll();
        }
      }
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
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
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
    font-size: 20px;
    margin: 2px;
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

/* DICE */

$size: 70px;

.die {
  position: absolute;
  display: flex;

  font-size: 24px;
  color: #FFF;
  font-weight: 800;
  cursor: pointer;

  mask-repeat: no-repeat;
  mask-position: center;

  .skin {
    width: 100%;
    height: 100%;
    background-color: #311;
    background-repeat: no-repeat;
    background-position: center;
    flex-shrink: 0;

    pointer-events: none;
  }

  span {
    position: absolute;
    width: 100%;
    pointer-events: none;
    text-shadow: 0 0 3px #000;
  }

  &.d100 {
    width: $size - 20;
    height: $size - 20;

    line-height: $size - 20;
  }

  &.d20 {
    width: 0.9 * $size;
    height: 0.95 * $size;
    line-height: 0.95 * $size;

    mask-image: url('./assets/d20.svg');

    .skin{ background-image: url('./assets/d20.svg'); }
  }

  &.d12 {
    width: 0.85 * $size;
    height: 0.9 * $size;
    line-height: 0.92 * $size;

    mask-image: url('./assets/d12.svg');

    .skin{ background-image: url('./assets/d12.svg'); }
  }

  &.d10 {
    width: 0.88 * $size;
    height: 0.88 * $size;
    line-height: 0.88 * $size;

    mask-image: url('./assets/d10.svg');

    .skin{ background-image: url('./assets/d10.svg'); }
  }

  &.d8 {
    width: 0.85 * $size;
    height: 0.85 * $size;
    line-height: 0.85 * $size;

    mask-image: url('./assets/d8.svg');

    .skin{ background-image: url('./assets/d8.svg'); }
  }

  &.d6 {
    width: 0.7 * $size;
    height: 0.7 * $size;
    line-height: 0.7 * $size;

    mask-image: url('./assets/d6.svg');

    .skin{ background-image: url('./assets/d6.svg'); }
  }

  &.d4 {
    width: 0.85 * $size;
    height: 0.7 * $size;
    line-height: 0.9 * $size;

    mask-image: url('./assets/d4.svg');

    .skin{ background-image: url('./assets/d4.svg'); }
  }

  &.custom {
    width: $size - 20;
    height: $size - 20;

    line-height: $size - 20;
  }
}

/* DICE SKINS */

.die .skin.default {
  &.red    {/* default */}
  &.orange { filter: hue-rotate(63deg) saturate(2.5) brightness(250%); }
  &.yellow { filter: hue-rotate(69deg) saturate(10) brightness(225%); }
  &.green  { filter: hue-rotate(160deg) brightness(200%); }
  &.blue   { filter: hue-rotate(225deg) brightness(200%); }
  &.purple { filter: hue-rotate(275deg) brightness(150%); }
  &.pink   { filter: hue-rotate(320deg) saturate(0.5) brightness(250%); }
  &.navy   { filter: hue-rotate(220deg); }
  &.teal   { filter: hue-rotate(177deg) brightness(225%); }
  &.wood   { filter: hue-rotate(62deg) saturate(0.6) brightness(300%); }
  &.black  { filter: saturate(0) contrast(115%); }
  &.white  { filter: saturate(0) brightness(500%); }
}

/* SETTINGS */

.menuScreen {
  position: absolute;
  top: 100vh;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 10px;

  background-color: #FFF;

  transition: top 0.1s ease-out;

  &.open {
    top: 0vh;
    transition: top 0.2s ease-in;
  }
}
</style>
