<template>
  <div class="menuScreen" :class="{open: open}">
    <button class="close" @click="$emit('close')">X</button>
    <h2>GENERAL SETTINGS</h2>
    <div class="general-settings">
      <label class="checkbox-container">
        <span>Shake phone to roll dice</span>
        <input type="checkbox" v-model="settings.shakeToRoll" />
        <span class="checkmark"></span>
      </label>
    </div>
    <h2>DICE SETTINGS</h2>
    <div class="subheader">BETA - Not all of these settings do anything yet</div>
    <table class="dice-settings">
      <thead>
        <tr>
          <th></th>
          <th>Use</th>
          <th>Critical Hit</th>
          <th>Critical Fail</th>
          <th>Explode</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(die, name) in settings.diceRack" :key="name">
          <td>{{ name }}</td>
          <td>
            <label class="checkbox-container inline">
              <input type="checkbox" v-model="die.active" />
              <span class="checkmark"></span>
            </label>
          </td>
          <td>
            <label class="checkbox-container inline">
              <input type="checkbox" v-model="die.critSuccess" />
              <span class="checkmark"></span>
            </label>
          </td>
          <td>
            <label class="checkbox-container inline">
              <input type="checkbox" v-model="die.critFail" />
              <span class="checkmark"></span>
            </label>
          </td>
          <td>
            <label class="checkbox-container inline">
              <input type="checkbox" v-model="die.exploding" />
              <span class="checkmark"></span>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
    <h2>DICE SKINS</h2>
    <div class="skins-list" v-if="open">
      <div
      v-for="(classes, name) in settings.colors"
      :key="name"
      class="choice"
      @click="pickDieSkin(name)"
      :class="{selected: settings.currentDiceSkin === classes}">
        <div class="die d20" :class="classes">
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

.menuScreen {
  position: absolute;
  top: 100vh;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 10px;
  padding-bottom: 60px;

  background-color: #FFF;

  transition: top 0.2s ease-out;

  &.open {
    top: 0vh;
    overflow-x: hidden;
  }
}

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

.dice-settings {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  table-layout: fixed;

  font-size: 22px;

  th {
    font-size: 18px;
  }
}

.subheader {
  margin-top: -16px;
  margin-bottom: 16px;
  color: $red;
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
    border-radius: 5px;
    cursor: pointer;

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
