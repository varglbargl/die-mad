<template>
  <div class="container" :style="{left: x - 30 + 'px', top: y - 30 + 'px'}">
    <svg viewBox="-60 -60 120 120">
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
        dur="0.5s"
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
        dur="0.5s"
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
        dur="0.5s"
        begin="0s"

        calcMode="spline"
        keyTimes="0; 0.5"
        keySplines="0 0.8 1 1;"/>

        <animate
        :xlink:href="'#sparkle-' + i + _uid"
        attributeName="opacity"

        from="0"
        :to="1"
        dur="0.5s"
        begin="0s"

        calcMode="spline"
        keyTimes="0; 0.5"
        keySplines="0 1 1 1;" />
      </g>
    </svg>
  </div>
</template>

<script>
import utils from '@/services/utils.js';

export default {
  name: 'CritAnimation',
  props: ['x', 'y'],
  data () {
    return {
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
    }, 500)
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
