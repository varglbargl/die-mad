<template>
  <main id="app">
    <div id="tabletop">
      <DX
      v-for="(die, i) in activeDice"
      :key="die.id"
      :sides="die.sides"
      v-model="rolls[i]"
      @kill="deleteDie(i)"
      ref="dice" />
    </div>
    <div class="dice-rack">
      <div
      v-for="(die, i) in diceRack"
      :key="i"
      @touchstart.prevent="createDie(die, $event)"
      @touchend.prevent="dropNewDie"
      @mousedown.prevent="createDie(die, $event)"
      @mouseup.prevent="dropNewDie"
      :class="'die d' + die">
        D{{ die }}
      </div>
    </div>
    <button @click="rollAll">ROLL ALL</button>
    <div class="total">
      Total: {{ totalRolled }}
    </div>
  </main>
</template>

<script>
import Vue from 'vue';
import DX from '@/components/DX.vue';

export default {
  name: 'app',
  components: {
    DX
  },
  data () {
    return {
      activeDice: [],
      diceRack: [20, 12, 10, 8, 6, 4],
      rolls: [],
      touched: null,
      count: 0
    }
  },
  computed: {
    totalRolled () {
      var total = 0;

      for (let i = 0; i < this.rolls.length; i++) {
        if (this.rolls[i]) total += this.rolls[i];
      }

      return total;
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
  justify-content: space-around;
  align-items: center;

  .die {
    display: inline-block;
    position: unset;
    font-size: 20px;
  }
}

/* DICE */

$size: 70px;

.die {
  position: absolute;

  font-size: 24px;
  color: #FFF;
  font-weight: 800;
  cursor: pointer;

  mask-repeat: no-repeat;
  mask-position: center;

  background-color: #311;
  background-repeat: no-repeat;
  background-position: center;

  span {
    pointer-events: none;
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
    background-image: url('./assets/d20.svg');
  }

  &.d12 {
    width: 0.8 * $size;
    height: 0.84 * $size;
    line-height: 0.88 * $size;

    mask-image: url('./assets/d12.svg');
    background-image: url('./assets/d12.svg');
  }

  &.d10 {
    width: 0.9 * $size;
    height: 0.9 * $size;
    line-height: 0.9 * $size;

    mask-image: url('./assets/d10.svg');
    background-image: url('./assets/d10.svg');
  }

  &.d8 {
    width: 0.85 * $size;
    height: 0.85 * $size;
    line-height: 0.85 * $size;

    mask-image: url('./assets/d8.svg');
    background-image: url('./assets/d8.svg');
  }

  &.d6 {
    width: 0.7 * $size;
    height: 0.7 * $size;
    line-height: 0.7 * $size;

    mask-image: url('./assets/d6.svg');
    background-image: url('./assets/d6.svg');
  }

  &.d4 {
    width: 0.85 * $size;
    height: 0.7 * $size;
    line-height: 0.9 * $size;

    mask-image: url('./assets/d4.svg');
    background-image: url('./assets/d4.svg');
  }

  &.custom {
    width: $size - 20;
    height: $size - 20;

    line-height: $size - 20;
  }
}
</style>
