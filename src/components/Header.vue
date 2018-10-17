<template>
  <div class="header-bar">
    <div class="header-wrap">
      <div class="logo">
        <router-link :to="{name: 'Home'}" tag="a">
          <img src="/static/web3data_logo_bug_color_v1.svg" alt="">
        </router-link>
      </div>

      <div class="header-menu">
        <a href="mailto:connect@web3data.org">
          <span>Contact Us</span>
        </a>
        <!-- <router-link :to="{name: 'list'}" tag="a">
          <span>Menu</span>
        </router-link> -->
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="scss" scoped>
@import '../scss/variables';

.header-bar {
  box-shadow: 0 0 20px -4px transparentize($black, 0.8);
  color: $color1;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0px;
  position: relative;
  width: 100%;
}

.logo {
  position: relative;
  margin: 0 0 5px;

  a {
    display: block;
    padding: 10px 0 0;
  }

  img {
    width: 120px;
  }
}

.header-wrap {
  display: flex;
  justify-content: space-between;
  padding: 0 15vw;
  margin: 0;
  width: 100%;
}

.header-menu {
  display: flex;

  a {
    color: $color1;
    display: flex;
    align-items: center;
    padding: 10px 1vw;
    font-weight: 900;
    font-size: 11pt;
    letter-spacing: 2px;
    margin: 0;
    text-transform: uppercase;
    text-decoration: none;
    text-align: center;

    &:hover {
      color: $primary;
      cursor: pointer;
    }

    &.not-active {
      cursor: default;
    }
  }
}
</style>
