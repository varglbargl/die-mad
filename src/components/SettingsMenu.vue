<template>
  <div class="menuScreen" :class="{open: open}">
    <button class="close" @click="$emit('close')">X</button>
    SKINS
    <div class="skins-list">
      <div
      v-for="(classes, name) in settings.colors"
      :key="name"
      class="choice"
      :class="{selected: settings.currentDiceSkin === classes}">
        <div @click="pickDieSkin(name)" class="die d20">
          <div class="skin" :class="classes"></div>
          <span>20</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import settings from '@/services/settings.js';

export default {
  name: 'SettingsMenu',
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      settings: settings
    }
  },
  methods: {
    pickDieSkin (color) {
      settings.currentDiceSkin = settings.colors[color];
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.skins-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;

  .choice {
    position: relative;
    border: 3px solid transparent;

    &.selected {
      border-color: $red;
    }

    .die {
      position: unset;
    }
  }
}
</style>
