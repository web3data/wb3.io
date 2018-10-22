<template>
  <div>&copy; wb3.io {{ year }} - <span>data with ♥ by <a href="https://amberdata.io" target="_blank">amberdata.io</a> </span> </div>
</template>

<script>
export default {
  name: 'Footer',

  data() {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables';

div {
  color: $black;
  font-size: 11pt;
  padding: 40px 0px 30px;
  text-align: center;
}
</style>
