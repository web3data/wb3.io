<template>
  <div>

    <div class="home">
      <SmartInput />
    </div>
    <PaintBackground />

    <div id="paintEffect" />

    <!-- <section class="intro">
      <div class="card">
        <h1>wb3.io <small>FAQ's</small> </h1>
        <h3>View Blockchain faster!</h3>
      </div>
    </section> -->

  </div>
</template>

<script>
import PaintBackground from './PaintBackground'
import SmartInput from './SmartInput'

export default {
  name: 'Home',

  data: function() {
    return {
      goo: null
    }
  },

  components: {
    PaintBackground,
    SmartInput
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

.home {
  background: $white;
  display: flex;
  margin: 0 0 auto;
}

.card {
  margin: 30vh auto;
  position: relative;
  z-index: 10;
  text-align: center;

  p {
    max-width: 35vw;
    text-align: right;
  }
}

.logo {
  width: 21vw;
  min-width: 200px;
}

.pg-title {
  text-indent: -9999px;
  font-size: 0px;
}

.grid {
  display: grid;
  grid-template-columns: 33.33% 33.33% 33.33%;
  margin: 0 20px;
}

.grid-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

// Tablet
@media screen and (min-width: $tablet) and (max-width: $desktop - 1px) {
  .grid {
    display: flex;
    flex-wrap: wrap;
  }

  .grid-cl-1 {
    order: 1;
    flex: 1 1 50%;
  }
  .grid-cl-2 {
    order: 3;
    flex-direction: row;
  }
  .grid-cl-3 {
    order: 2;
    flex: 1 1 50%;
  }
}

// Mobile
@media screen and (max-width: $tablet - 1px) {
  .grid {
    display: flex;
    flex-wrap: wrap;
  }

  .grid-cl-1 {
    order: 1;
    flex: 1 1 100%;
  }
  .grid-cl-2 {
    order: 3;
  }
  .grid-cl-3 {
    order: 2;
    flex: 1 1 100%;
  }
}
</style>
