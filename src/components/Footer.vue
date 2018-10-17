<template>
  <div>&copy; wb3.io {{ year }}</div>
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
  background: darken($color2, 10%);
  color: $white;
  font-size: 11pt;
  padding: 40px 0px 30px;
  text-align: center;
}
</style>
