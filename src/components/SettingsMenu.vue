<template>
  <div class="menuScreen" :class="{open: open}">
    <button class="close" @click="$emit('close')">X</button>
    <h3>SETTINGS</h3>
    <div class="general-settings">
      <label class="container">
        <span>Shake phone to roll dice</span>
        <input type="checkbox" v-model="settings.shakeToRoll" />
        <span class="checkmark"></span>
      </label>
    </div>
    <h3>DICE SKINS</h3>
    <div class="skins-list">
      <div
      v-for="(classes, name) in settings.colors"
      :key="name"
      class="choice"
      :class="{selected: settings.currentDiceSkin === classes}">
        <div @click="pickDieSkin(name)" class="die d20" :class="classes">
          <div class="skin" :class="classes"></div>
          <span>20</span>
        </div>
        <span style="font-weight: 500">{{ titlize(name) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import settings from '@/services/settings.js';
import utils from '@/services/utils.js';

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
    },
    titlize (str) {
      return utils.titlize(str);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/styles/checkbox.scss";

.close {
  position: absolute;
  top: 10px;
  right: 10px;

  font-size: 20px;
}

.general-settings {
  max-width: 400px;
  margin: 0 auto;
}

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
      margin: 0 auto;

      span {
        left: calc(50% - 14px);
        width: auto;
      }
    }
  }
}
</style>
