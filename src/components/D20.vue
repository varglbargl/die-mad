<template>
  <div class="die" @click="throwDie" :class="{blue: speed > 0}">
    {{ value }}
    <span class="small">{{ speed.toFixed(2) }}</span>
  </div>
</template>

<script>
import utils from '@/services/utils.js';

export default {
  name: 'D20',
  data () {
    return {
      value: 20,
      vector: [0, 0]
    }
  },
  computed: {
    speed() {
      let magnitude = (Math.sqrt(Math.pow(this.vector[0], 2) + Math.pow(this.vector[1], 2)));
      return magnitude;
    }
  },
  methods: {
    roll () {
      this.value = utils.rollDie(1, 20);
    },
    throwDie () {
      if (this.speed > 0) {
        this.roll();
        this.vector = [4, 4];
        return;
      }

      this.vector = [4, 4];

      let tickDownSpeed = () => {
        if (this.speed > 0.02) {
          this.vector = utils.multiplyVector(this.vector, 0.85);
          setTimeout(tickDownSpeed, 100);
        } else {
          this.vector = [0, 0];
        }
      }

      tickDownSpeed();

      let changeDieSide = () => {
        if (this.speed !== 0) {
          this.roll();
          setTimeout(changeDieSide, Math.round(200 / this.speed));
        }
      }

      changeDieSide();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.die {
  $size: 70px;

  position: relative;
  width: $size;
  height: $size;

  background-color: $red;

  font-size: 24px;
  color: #FFF;
  font-weight: 800;
  line-height: $size;

  mask-image: url('../assets/hexagon.svg');
  mask-repeat: no-repeat;
  mask-position: center;
}

.blue {
  background-color: $blue;
}

.small {
  position: absolute;
  bottom: 15px;
  left: 25px;

  font-size: 8;
  line-height: 0;
  font-size: 10px;
}
</style>
