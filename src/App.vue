<template>
  <main id="app">
    <D20 />
  </main>
</template>

<script>
import D20 from './components/D20.vue';

export default {
  name: 'app',
  components: {
    D20
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
