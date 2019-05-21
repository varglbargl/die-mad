<template>
  <main id="app">
    <div id="tabletop">
      <D20 />
    </div>
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

html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#tabletop {
  width: 100vw;
  height: calc(100vh - #{$menu-height});

  background-color: $felt-green;
  overflow: show;
}
</style>
