<template>
  <main id="app">
    <div id="tabletop">
      <DX
      v-for="(die, i) in activeDice"
      :key="i"
      :sides="die"
      v-model="rolls[i]"
      ref="dice" />
    </div>
    <button @click="rollAll">ROLL ALL</button>
    <div class="total">
      Total: {{ totalRolled }}
    </div>
  </main>
</template>

<script>
import DX from './components/DX.vue';

export default {
  name: 'app',
  components: {
    DX
  },
  data () {
    return {
      activeDice: [20, 12, 10, 8, 6, 4],
      rolls: []
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
      this.rolls = [];
      for (let i = 0; i < this.$refs.dice.length; i++) {
        this.$refs.dice[i].throwDieRandomly();
      }
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
</style>
