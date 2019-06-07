<template>
  <div class="cheevo-list">
    <div
    class="cheevo"
    v-for="(cheevo, i) in recentAchievements"
    :key="cheevo.id"
    @click="dismissAchievement(i)">
      <h3>{{ cheevo.cheevo.name }}</h3>
      <span>{{ cheevo.cheevo.description }}</span>
    </div>
  </div>
</template>

<script>
import { recentAchievements, checkAchievements } from '@/services/cheevos.js';

export default {
  name: 'Achievements',
  data() {
    return {
      recentAchievements
    }
  },
  methods: {
    checkAchievements () {
      checkAchievements();
    },
    dismissAchievement (index) {
      recentAchievements.splice(index, 1);
    }
  },
  mounted() {
  },
  watch: {
    recentAchievements () {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.cheevo-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  z-index: 50;
}

.cheevo {
  padding: 12px;
  margin: 8px auto;
  width: 200px;
  border-radius: 8px;

  background-color: #222;

  color: #FFF;
}
</style>
