<template>
  <div
  class="die"
  :class="dieType"
  @mousedown.prevent="dragStart"
  @touchstart.prevent="dragStart"
  @mouseup.prevent="dragStop"
  @touchend.prevent="dragStop"
  :style="{top: y + 'px', left: x + 'px', zIndex: dragging ? 100 : 'unset'}">
    <div class="skin" :class="skin"></div>
    <span>{{ value }}</span>
    <!-- <span class="small">{{ sides }}</span> -->
  </div>
</template>

<script>
import utils from '@/services/utils.js';

export default {
  name: 'DX',
  props: {
    sides: {
      required: true
    },
    skin: {
      type: String,
      defult: 'default red'
    }
  },
  data () {
    return {
      value: this.sides,
      vector: [0, 0],
      x: 10,
      y: 10,
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0
    }
  },
  computed: {
    dieType () {
      switch (parseInt(this.sides)) {
        case 100:
          return 'd100';
        case 20:
          return 'd20';
        case 12:
          return 'd12';
        case 10:
          return 'd10';
        case 8:
          return 'd8';
        case 6:
          return 'd6';
        case 4:
          return 'd4';
        default:
          return 'custom';
      }
    },
    speed () {
      let magnitude = (Math.sqrt(Math.pow(this.vector[0], 2) + Math.pow(this.vector[1], 2)));
      return magnitude;
    }
  },
  methods: {
    dragStart (evt) {
      this.vector = [0, 0];
      this.dragging = true;

      if (evt.changedTouches) {
        this.dragOffsetX = this.x - evt.changedTouches[0].clientX;
        this.dragOffsetY = this.y - evt.changedTouches[0].clientY;
        document.getElementById('app').addEventListener('touchmove', this.handleDrag);

      } else if (evt.clientX && evt.clientY) {
        this.dragOffsetX = this.x - evt.clientX;
        this.dragOffsetY = this.y - evt.clientY;
        document.getElementById('app').addEventListener('mousemove', this.handleDrag);
      }
    },
    dragStop () {
      this.dragging = false;
      this.$parent.touched = null;

      if (this.y - this.dragOffsetY > document.getElementById('tabletop').offsetHeight) {
        this.$emit('kill');
      }

      this.hitTestWalls();

      document.getElementById('app').removeEventListener('mousemove', this.handleDrag);
      document.getElementById('app').removeEventListener('touchmove', this.handleDrag);
    },
    handleDrag (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.changedTouches) {
        this.x = e.changedTouches[0].clientX + this.dragOffsetX;
        this.y = e.changedTouches[0].clientY + this.dragOffsetY;

        this.hitTestWalls(); // i honestly cannot believe this works so flawlessly

      } else if (e.clientX && e.clientY) {
        this.x = e.clientX + this.dragOffsetX;
        this.y = e.clientY + this.dragOffsetY;

        this.hitTestWalls(); // like holy shit i just throw this in here and we're good??
      }

      return false;
    },
    roll () { // without rolling animations
      this.value = utils.rollDie(1, this.sides);
    },
    throwDie () { // with rolling animations

      let tickDownSpeed = () => {
        if (this.speed > 0.02) {
          this.vector = utils.multiplyVector(this.vector, 0.95);

          this.x += this.vector[0];
          this.y += this.vector[1];

          this.hitTestWalls();

          setTimeout(tickDownSpeed, 25);

        } else {
          this.vector = [0, 0];
          this.$emit('input', this.value);
        }
      }

      let changeDieSide = () => {
        if (this.speed !== 0) {
          this.roll();
          setTimeout(changeDieSide, Math.round(200 / this.speed));
        }
      }

      tickDownSpeed();
      changeDieSide();
    },
    throwDieRandomly () {
      var randomVector = [Math.round(Math.random() * 80 - 40), Math.round(Math.random() * 80 - 40)];

      if (this.speed > 0) {
        this.roll();
        this.vector = randomVector;

      } else {
        this.vector = randomVector;
        this.throwDie();
      }
    },
    hitTestWalls () {
      let xMin = 0;
      let yMin = 0;
      let xMax = document.getElementById('tabletop').offsetWidth;
      let yMax = document.getElementById('tabletop').offsetHeight;

      if (this.dragging) {
        yMax += 70;
      }

      if (this.x < xMin) {
        this.x = yMin;
        this.vector[0] = this.vector[0] * -1;
      }

      if (this.x + this.$el.offsetWidth > xMax) {
        this.x = xMax - this.$el.offsetWidth;
        this.vector[0] = this.vector[0] * -1;
      }

      if (this.y < yMin) {
        this.y = yMin;
        this.vector[1] = this.vector[1] * -1;
      }

      if (this.y + this.$el.offsetHeight > yMax) {
        this.y = yMax - this.$el.offsetHeight;
        this.vector[1] = this.vector[1] * -1;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.small {
  position: absolute;
  bottom: 15px;
  left: 25px;

  font-size: 8;
  line-height: 0;
  font-size: 10px;
}
</style>
