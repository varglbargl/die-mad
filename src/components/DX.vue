<template>
  <div
  class="die"
  :class="[dieType, {rolling: speed > 0}]"
  @mousedown.prevent="dragStart"
  @touchstart.prevent="dragStart"
  @mouseup.prevent="dragStop"
  @touchend.prevent="dragStop"
  :style="dieStyles">
    <div class="skin" :class="skin"></div>
    <span>{{ value }}</span>
  </div>
</template>

<script>
import utils from '@/services/utils.js';
import settings from '@/services/settings.js';

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
      dragOffsetY: 0,
      rotateTo: 0,
      dieSettings: settings.getDieSettings(this.sides)
    }
  },
  computed: {
    dieType () {
      return utils.getDieType(this.sides);
    },
    speed () {
      let magnitude = (Math.sqrt(Math.pow(this.vector[0], 2) + Math.pow(this.vector[1], 2)));
      return magnitude;
    },
    dieStyles () {
      return {
        top: this.y + 'px',
        left: this.x + 'px',
        zIndex: this.dragging ? 100 : 'unset',
        transform: 'rotate(' + this.rotateTo + 'deg)'
      }
    }
  },
  methods: {
    dragStart (evt) {
      this.vector = [0, 0];
      this.dragging = true;
      this.$parent.touched = this;

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
        if (this.speed > 0.03) {
          this.vector = utils.multiplyVector(this.vector, 0.85);

          this.x += this.vector[0];
          this.y += this.vector[1];

          this.hitTestWalls();

          setTimeout(tickDownSpeed, 25);

        } else {
          this.vector = [0, 0];
          this.rotateTo = 0;
          this.$emit('input', this.value);

          // CRITS! EXPLODING DICE! Todo: add crit range to the settings

          if (this.dieSettings.critSuccess && this.value === this.sides) {
            this.$emit('crit', ['success', this.x, this.y]);
          } else if (this.dieSettings.critFail && this.value === 1) {
            this.$emit('crit', ['fail', this.x, this.y]);
          }

          if (this.dieSettings.exploding && this.value === this.sides) {
            this.$emit('explode', [this.sides, this.x, this.y]);
          }
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
      var magnitude = 120;
      var randomVector = [
        Math.round(Math.random() * magnitude - magnitude / 2),
        Math.round(Math.random() * magnitude - magnitude / 2)
      ];
      var randomRotation = Math.round(Math.random() * 4 - 2) * 360;

      // not perfect but look it's good enough and more importantly it's gotten complicated enough.
      if (this.rotateTo === randomRotation) {
        if (randomRotation === 0) {
          randomRotation = 360 * (Math.round(Math.random()) === 1 ? 1 : -1);
        } else {
          randomRotation = randomRotation * -1;
        }
      }
      this.rotateTo = randomRotation;

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
      let hitWall = false;

      if (this.dragging) {
        yMax += 70;
      }

      if (this.x < xMin) {
        this.x = yMin;
        this.vector[0] = this.vector[0] * -1;
        hitWall = true;
      }

      if (this.x + this.$el.offsetWidth > xMax) {
        this.x = xMax - this.$el.offsetWidth;
        this.vector[0] = this.vector[0] * -1;
        hitWall = true;
      }

      if (this.y < yMin) {
        this.y = yMin;
        this.vector[1] = this.vector[1] * -1;
        hitWall = true;
      }

      if (this.y + this.$el.offsetHeight > yMax) {
        this.y = yMax - this.$el.offsetHeight;
        this.vector[1] = this.vector[1] * -1;
        hitWall = true;
      }

      if (hitWall && this.speed > 1 && settings.vibrateOnCollision) {
        utils.hapticFeedback(20);
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
