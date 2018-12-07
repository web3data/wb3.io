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

      <!-- TODO: Rename -->
      <div class="section">
        <div class="faqs w-100">
          <h2>Frequently Asked Questions</h2>
          <div v-for="faq in faqs">
            <CollapseCard :title="faq.question" :content="faq.answer"/>
          </div>
        </div>
        <div class="searches w-100">
          <div class="inline">
            <h2>Your Recent Searches</h2>
            <button @click="clearSearches" type="button" name="button">clear all</button>
          </div>

          <div v-for="search in searches">
            <div class="search" @click="openLink(search.url)">
              <p>{{ search.term }}</p>
              <img src="/static/arrow.svg" alt="">
            </div>
          </div>
        </div>
      </div>

      <Footer />

    </div>

  </div>
</template>

<script>
import Footer from './Footer.vue'
import PaintBackground from './PaintBackground'
import SmartInput from './SmartInput'
import CollapseCard from './CollapseCard.vue'
import faqs from '../../static/faqs.json'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Home',

  data: function() {
    return {
      goo: null,
      faqs: faqs
    }
  },

  components: {
    Footer,
    PaintBackground,
    SmartInput,
    CollapseCard
  },

  computed: {
    ...mapGetters(['searches'])
  },

  methods: {
    ...mapActions(['loadStorage', 'clearSearches']),
    openLink(url) {
      window.open(url, '_blank')
    }
  },

  created() {
    this.loadStorage()
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
  // justify-content: space-between;
  flex-direction: column;
}

.subtitle-copy {
  display: flex;
  padding: 0 $gutter;
  width: 60vw;
  margin: 0 auto;
  justify-content: space-between;
  margin-bottom: 125px;
  h5 {
    color: $grey03;
  }

  h6 {
    color: $grey05;
  }
}
// TODO: Discuss with Trev consolidate .subt... and .sec..
.section {
  display: flex;
  padding: 0 $gutter;
  width: 60vw;
  margin: 0 auto;
  justify-content: space-between;
  flex-direction: row;
  min-height: 200px;
  h2 {
    color: $black;
    font-size: 16pt;
    line-height: 19px;
    margin: 0;
    padding-bottom: 7px;
  }
  .w-100 {
    width: 100%;
  }
  .inline {
    display: flex;
    justify-content: space-between;
  }
  .faqs {
    margin-right: 20px;
  }
  .searches {
    button {
      border-radius: 0;
      border-style: solid;
      border-width: 0 0 1px 0;
      background-color: transparent;
      border-color: $grey05;
      color: $grey05;
      padding: 0;
      -webkit-appearance: none;
      width: auto;
      height: fit-content;
      align-self: center;
      cursor: pointer;
      line-height: 15px;
      transition: all 100ms ease-in-out;
      &:hover {
        border-color: $black;
        color: $black;
      }
    }
    .search {
      height: 40px;
      padding: 0 15px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: $white;
      border-radius: 3px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0 2px 10px -2px transparentize($black, 0.85);
      font-size: 10pt;
      margin-top: 10px;
      &:hover {
        background-color: #fdffe3;
      }
      img {
        height: 11pt;
      }
    }
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

@media only screen and (max-width: 600px) {
  .section {
    width: 90vw;
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
    margin-bottom: 40px;

    h5 {
      padding: 0 $gutter;
    }

    h6 {
      display: none;
    }
  }

  .section {
    flex-direction: column;

    .faqs {
      margin-bottom: 40px;
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
