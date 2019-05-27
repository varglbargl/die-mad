<template>
  <div class="container" :style="{left: x - 30 + 'px', top: y - 30 + 'px'}">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-60 -60 120 120" v-if="type === 'success'">
      <g
      v-for="(spark, i) in sparkles(8)"
      :key="i">

        <circle
        v-if="spark.shape === 'circle'"
        :id="'sparkle-' + i + _uid"
        :transform="'rotate(' + spark.rot +')'"
        :r="spark.size"
        cx="0"
        cy="0"
        opacity="0"
        :fill="colorByIndex(i)" />

        <g
        :transform="'rotate(' + spark.rot +')'"
        v-if="spark.shape === 'star'">
          <g
          transform="translate(0 0)"
          :id="'sparkle-' + i + _uid"
          opacity="0">
            <g :id="'spinner-' + i + _uid" transform-origin="6.9 6.9">
              <path
              :transform="'scale(' + 2.5 / spark.size + ')'"
              d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
              :fill="colorByIndex(i)"
              />
            </g>
          </g>
        </g>

        <animateTransform
        v-if="spark.shape === 'star'"
        :xlink:href="'#sparkle-' + i + _uid"
        attributeName="transform"
        attributeType="XML"
        type="translate"

        from="0 0"
        :to="Math.round(Math.random() * 20 + 25) + ' 0'"
        :dur="timers[type] + 's'"
        begin="0s"

        calcMode="spline"
        keyTimes="0; 0.5"
        keySplines="0 0.8 1 1;"/>

        <animateTransform
        :xlink:href="'#spinner-' + i + _uid"
        attributeName="transform"
        attributeType="XML"
        type="rotate"

        from="0"
        :to="Math.round(Math.random()) === 1 ? 360 : -360"
        :dur="timers[type] + 's'"
        begin="0s"

        calcMode="spline"
        keyTimes="0; 0.5"
        keySplines="0 0.8 1 1;" />

        <animate
        v-if="spark.shape === 'circle'"
        :xlink:href="'#sparkle-' + i + _uid"
        attributeName="cx"

        from="0"
        :to="Math.random() * 20 + 25"
        :dur="timers[type] + 's'"
        begin="0s"

        calcMode="spline"
        keyTimes="0; 0.5"
        keySplines="0 0.8 1 1;"/>

        <animate
        :xlink:href="'#sparkle-' + i + _uid"
        attributeName="opacity"

        from="0"
        to="1"
        :dur="timers[type] + 's'"
        begin="0s"

        calcMode="spline"
        keyTimes="0; 0.5"
        keySplines="0 1 1 1;" />
      </g>
    </svg>

    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" v-if="type === 'fail'">
      <g :id="'skull-' + _uid" transform="scale(0)" transform-origin="60px 60px">
        <path fill="#507" stroke="#90C" stroke-width="4px"
        d="m106.992237,58.165814c-2.3,-1.7 -5.1,0.4 -6.8,-0.9c-3.6,-2.8 5.5,-14 4.9,-25c-0.9,-15.2 -20,-25.1 -21.1,-25.6c-23.3,-11.7 -57.6,-0.1 -67.9,20.4c-1.5,3 -6.3,12.9 -2.9,23.2c3.4,10.3 13.4,16.5 11,20.7c-1.6,2.8 -6.7,1.3 -8.4,4.6c-1.6,3 0.6,8.2 4.2,10.8c5.6,4 12.4,0.6 14,3.4c1.8,3.2 -7.2,8 -6.2,14.4c0.8,5.3 8.3,9.9 11.7,8.4c5.4,-2.3 0.1,-19.2 5.4,-21c1.5,-0.5 3.7,0.4 4.8,1.6c4.1,4.8 -6.3,14.4 -2.7,20.3c2.8,4.5 13,5.6 15.9,2.2c4.2,-4.9 -7.9,-17.6 -3.2,-22.5c1.6,-1.6 4.7,-2.1 6.7,-1c5.9,3.2 -1.3,18.3 4.7,22.2c3.8,2.5 12.3,-0.1 14.3,-4.6c2.9,-6.5 -8.4,-14.1 -4.9,-20.5c1.1,-2 3.6,-3.7 5.4,-3.3c5.4,1.3 1.6,19.8 7.3,21.6c3.5,1.1 10.5,-4.3 11,-10.2c0.7,-7.9 -10.5,-12.1 -8.8,-17.8c1.4,-4.6 8.9,-3.4 12.3,-10c2,-3.9 1.9,-9.4 -0.7,-11.4zm-60.5,5.9c-4.8,3.3 -12.7,3.5 -15.6,0c-1.2,-1.4 -1.9,-3.9 -1,-5.6c1.2,-2.1 4,-1.2 6.2,-3.4c2.5,-2.5 0.5,-5.2 2.6,-7.7c2.4,-2.8 8.4,-3.5 11.4,-1.2c4.3,3.3 2.7,13.6 -3.6,17.9zm18.7,10.6c-0.5,0.6 -1.6,0.6 -2.3,0.3c-2.5,-0.8 -3.1,-4.9 -3.8,-4.7c-0.7,0.1 0.2,3.4 -1.5,4.8c-0.8,0.7 -2.3,0.9 -3,0.3c-2,-1.8 1.7,-10.1 2.6,-9.9c0.4,0.1 0.1,1.8 1.1,2.3c0.4,0.2 0.9,0.2 1.2,0c1,-0.6 0.6,-2.2 1.1,-2.4c1.1,-0.5 6.3,7.3 4.6,9.3zm24.9,-16.5c-4.2,5 -16.9,4.7 -23.7,-1.9c-6,-5.8 -8,-17 -2.4,-21.3c3.7,-2.8 10.6,-2.5 14.1,0.6c3.2,2.7 1.5,5.5 5.2,9.3c3.5,3.5 6.8,2.8 8.1,5.9c1.1,2.4 0.3,5.6 -1.3,7.4z" />

        <animateTransform
        :xlink:href="'#skull-' + _uid"
        attributeName="transform"
        attributeType="XML"
        type="scale"

        from="0"
        to="0.7"
        :dur="timers[type] + 's'"
        begin="0s"

        calcMode="spline"
        keyTimes="0; 0.5"
        keySplines="0 0.8 1 1;" />

        <animate
        :xlink:href="'#skull-' + _uid"
        attributeName="opacity"

        values="0; 0.6; 0"
        :dur="timers[type] + 's'"
        begin="0s"

        calcMode="spline"
        keyTimes="0; 0.7; 1"
        keySplines="0 0.5 0.5 1; 0.5 0 1 0.5;" />
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
        result.push({ rot: 360 / num * [i], size: Math.ceil(Math.random() * 3 + 3), shape: utils.getRandom(shapes) })
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
</style>
