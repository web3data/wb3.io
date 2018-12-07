<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',

  watch: {
    $route(to) {
      if (!window.gtag) return
      // update google analytics
      window.gtag('config', 'UA-127982765-1', {
        page_title: to.name,
        page_path: to.fullPath
      })
    }
  }
}
</script>

<style lang="scss">
@import './scss/main.scss';
html {
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: $black;
  }
  overflow: hidden scroll;
}
body {
  background: #f9f9f9;
  padding: 0;
  margin: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $primary;
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
