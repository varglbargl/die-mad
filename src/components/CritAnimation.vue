<template>
  <div class="container" :style="{left: x - 30 + 'px', top: y - 30 + 'px'}">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-60 -60 120 120" v-if="type === 'success'">
      <g
      v-for="(spark, i) in sparkles(8)"
      :key="i"
      :transform="'rotate(' + spark.rot +')'">

        <circle
        v-if="spark.shape === 'circle'"
        class="sparkle"
        :r="spark.size"
        :fill="colorByIndex(i)" />

        <g
        v-if="spark.shape === 'star'">
          <g
          class="sparkle">
            <g class="spinner" transform-origin="6.9 6.9">
              <path
              :transform="'scale(' + 2.5 / spark.size + ')'"
              d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
              :fill="colorByIndex(i)"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>

    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" v-if="type === 'fail'">
      <g class="skull" transform-origin="60px 60px">
        <path fill="#507" stroke="#90C" stroke-width="4px"
        d="m106.992237,58.165814c-2.3,-1.7 -5.1,0.4 -6.8,-0.9c-3.6,-2.8 5.5,-14 4.9,-25c-0.9,-15.2 -20,-25.1 -21.1,-25.6c-23.3,-11.7 -57.6,-0.1 -67.9,20.4c-1.5,3 -6.3,12.9 -2.9,23.2c3.4,10.3 13.4,16.5 11,20.7c-1.6,2.8 -6.7,1.3 -8.4,4.6c-1.6,3 0.6,8.2 4.2,10.8c5.6,4 12.4,0.6 14,3.4c1.8,3.2 -7.2,8 -6.2,14.4c0.8,5.3 8.3,9.9 11.7,8.4c5.4,-2.3 0.1,-19.2 5.4,-21c1.5,-0.5 3.7,0.4 4.8,1.6c4.1,4.8 -6.3,14.4 -2.7,20.3c2.8,4.5 13,5.6 15.9,2.2c4.2,-4.9 -7.9,-17.6 -3.2,-22.5c1.6,-1.6 4.7,-2.1 6.7,-1c5.9,3.2 -1.3,18.3 4.7,22.2c3.8,2.5 12.3,-0.1 14.3,-4.6c2.9,-6.5 -8.4,-14.1 -4.9,-20.5c1.1,-2 3.6,-3.7 5.4,-3.3c5.4,1.3 1.6,19.8 7.3,21.6c3.5,1.1 10.5,-4.3 11,-10.2c0.7,-7.9 -10.5,-12.1 -8.8,-17.8c1.4,-4.6 8.9,-3.4 12.3,-10c2,-3.9 1.9,-9.4 -0.7,-11.4zm-60.5,5.9c-4.8,3.3 -12.7,3.5 -15.6,0c-1.2,-1.4 -1.9,-3.9 -1,-5.6c1.2,-2.1 4,-1.2 6.2,-3.4c2.5,-2.5 0.5,-5.2 2.6,-7.7c2.4,-2.8 8.4,-3.5 11.4,-1.2c4.3,3.3 2.7,13.6 -3.6,17.9zm18.7,10.6c-0.5,0.6 -1.6,0.6 -2.3,0.3c-2.5,-0.8 -3.1,-4.9 -3.8,-4.7c-0.7,0.1 0.2,3.4 -1.5,4.8c-0.8,0.7 -2.3,0.9 -3,0.3c-2,-1.8 1.7,-10.1 2.6,-9.9c0.4,0.1 0.1,1.8 1.1,2.3c0.4,0.2 0.9,0.2 1.2,0c1,-0.6 0.6,-2.2 1.1,-2.4c1.1,-0.5 6.3,7.3 4.6,9.3zm24.9,-16.5c-4.2,5 -16.9,4.7 -23.7,-1.9c-6,-5.8 -8,-17 -2.4,-21.3c3.7,-2.8 10.6,-2.5 14.1,0.6c3.2,2.7 1.5,5.5 5.2,9.3c3.5,3.5 6.8,2.8 8.1,5.9c1.1,2.4 0.3,5.6 -1.3,7.4z" />
      </g>
    </svg>

  </div>
</template>

<script>
import utils from '@/services/utils.js';

export default {
  name: 'CritAnimation',
  props: ['x', 'y', 'type'],
  data () {
    return {
      timers: {
        fail: 0.7,
        success: 0.5
      }
    }
  },
  methods: {
    sparkles (num) {
      var result = [];
      var shapes = ['circle', 'star'];

      for (var i = 0; i < num; i++) {
        result.push({ rot: 360 / num * i, size: Math.ceil(Math.random() * 3 + 3), shape: utils.getRandom(shapes) })
      }

      return result;
    },
    colorByIndex (i) {
      var colors = ["#FF0", "#FF9", "#FFF"];

      return colors[i % colors.length];
    }
  },
  created () {
    setTimeout(() => {
      this.$emit('kill');
    }, this.timers[this.type] * 1000)
  }
}
</script>

<style lang="scss" scoped>

* {
  pointer-events: none; /* good thing this is scoped */
}

svg {
  width: 120px;
  height: 120px;
}

.container {
  position: absolute;
  z-index: 70;
}

@keyframes move {
  from {
    transform: translate(0px);
    opacity: 0;
  }
  to {
    transform: translate(40px);
    opacity: 1;
  }
}

@keyframes spin {
  from {transform: rotate(0deg)}
  to {transform: rotate(360deg)}
}

@keyframes smoke {
  0% {
    transform: scale(0.2);
    opacity: 0;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
}

.sparkle {
  animation: move 0.5s ease-out infinite;
}

.spinner {
  animation: spin 0.5s ease-out infinite;
}

.skull {
  animation: smoke 0.7s ease-out infinite;
}
</style>
