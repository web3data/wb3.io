<template>
  <div>

    <div class="home">
      <SmartInput />
    </div>

    <div class="main-content">
      <PaintBackground />
      <div class="subtitle-copy">
        <h5>View blockchain faster!</h5>
        <h6>Start typing to search</h6>
      </div>

      <!-- <section class="intro">
        <div class="card">
          <h1>wb3.io <small>FAQ's</small> </h1>
        </div>
      </section> -->

      <Footer />
    </div>

  </div>
</template>

<script>
import Footer from './Footer.vue'
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
    Footer,
    PaintBackground,
    SmartInput
  }
}
</script>

<style lang="scss">
@import '../scss/variables.scss';

.home {
  background: $white;
  display: flex;
  margin: 0 0 auto;
}

.main-content {
  position: relative;
  min-height: calc(70vh - 62px);
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.subtitle-copy {
  display: flex;
  padding: 0 $gutter;
  width: 60vw;
  margin: 0 auto;
  justify-content: space-between;

  h5 {
    color: $grey03;
  }

  h6 {
    color: $grey05;
  }
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
}

// Mobile
@media screen and (max-width: $tablet - 1px) {
  .main-content {
    min-height: calc(85vh - 90px);
  }

  .subtitle-copy {
    width: 100%;
    padding: 0;

    h5 {
      padding: 0 $gutter;
    }

    h6 {
      display: none;
    }
  }

  .typeahead-input {
    font-size: 16pt !important;
    line-height: 19pt !important;
  }

  .typeahead-list-item {
    .fa-icon,
    span + span + span {
      display: none;
    }

    .icon-wrap {
      width: 0;
    }

    h2 {
      font-size: 11pt;
    }

    span {
      max-width: 30vw;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .typeahead-list-item span {
      margin: auto 5px auto 0;
    }

    .typeahead-label {
      font-size: 8pt;
      max-width: initial;
      overflow: initial;
      padding: 0 3px;
    }
  }
}
</style>
