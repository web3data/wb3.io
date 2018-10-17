<template>
  <div class="home">

    <section class="intro">
      <div class="card">
        <h1>wb3.io</h1>
        <h3>View Blockchain faster!</h3>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

.home {
  margin: auto;
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
