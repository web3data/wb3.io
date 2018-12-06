<template>
  <div class="smart-input">
    <img class="logo" src="/static/wb3.io.svg" alt="">

    <div class="input-hodler">
      <TypeAhead
        id="search-typeahead"
        name="typeahead"
        :placeholder="placeholder"
        :on-input="handleInput"
        :on-select="handleSelect"
        :on-deselect="resetSearch"
        :debounce="150"
      />
    </div>

    <div class="gothere">
      <div :class="{'go-action': true, active: tmpTerm}">
        <img class="btn-img" src="/static/arrow.svg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TypeAhead from './TypeAhead'

const hint = 'Search...'
// const hint = 'Search for Tokens, Contracts, Addresses, Transactions, Blocks...'
// 1: 'Hit Enter to select item, use Arrow Keys to navigate search items'

const rotatingExamples = [
  'CryptoKitties',
  'ZRX',
  'Status',
  'Golem',
  'TRX',
  '0x086',
  '6328472'
]

export default {
  name: 'SmartInput',

  components: {
    TypeAhead
  },

  data() {
    return {
      initial: false,
      searchQuery: '',
      queryTerm: '',
      placeholder: rotatingExamples[0],
      placeholderHint: hint,
      previousQuery: '',
      previousTypes: [],
      activeHint: hint
    }
  },

  computed: {
    ...mapGetters(['bookmarks', 'categories', 'tmpTerm', 'query', 'results']),
    ...mapGetters('user', ['isAuthenticated']),
    bookmarked() {
      if (!this.bookmarks || this.bookmarks.length <= 0) return false
      if (!this.query.term || this.query.term === '') return false

      let hasBookmark = false
      // Cheater method :D
      this.bookmarks.forEach(b => {
        if (b && b.term === this.query.term) hasBookmark = true
      })

      return hasBookmark
    }
  },

  methods: {
    ...mapActions([
      'addBookmark',
      'postQuery',
      'resetSearch',
      'setSearchQuery',
      'toggleActive',
      'updateKeyValue',
      'addSearch'
    ]),
    close() {
      this.toggleActive()
      // this.$analytics.event('Search - Query Close')
    },
    goToPage(path) {
      // Go to page!
      const url = `https://amberdata.io/${path}`
      this.addSearch(url)
      window.open(url, '_blank')
    },
    goToSearch(data) {
      if (!data || !data.data || !data.data.type) {
        this.goToPage(`search?q=${data.term}`)
        return
      }
      const match = data.data.match
      let path = ''

      switch (data.data.type) {
        case 'block':
          path = `blocks/${match.number || match.hash}`
          break
        case 'token':
          path = `addresses/${match.address}`
          break
        case 'contract':
          path = `addresses/${match.address || match.hash}`
          break
        case 'address':
          path = `addresses/${match.hash || match.address}`
          break
        case 'transaction':
          path = `transactions/${match.hash}`
          break
        case 'log':
          if (match.transactionHash)
            path = `transactions/${match.transactionHash}`
          else if (match.blockNumber) path = `blocks/${match.blockNumber}`
          break
        case 'uncle':
          path = `uncles/${match.hash}`
          break
      }
      this.goToPage(path)
    },
    handleSelect(data) {
      this.setSearchQuery({ term: data.term })
      // this.sendRequest()
      this.updateKeyValue({ key: 'tmpTerm', value: data.term })
      this.goToSearch(data)
    },
    handleInput(term) {
      if (!this.initial) this.initial = true
      if (!term || term.length < 1) {
        this.resetSearch()
        this.updateKeyValue({ key: 'tmpTerm', value: null })
      }
      this.activeHint = hint
      this.updateKeyValue({ key: 'tmpTerm', value: term })
    },
    request() {
      // Very minor checks, then start
      if (!this.query || !this.query.term || this.query.term.length < 1) return
      if (this.query.term === 'undefined' || this.query.term === undefined)
        return

      this.postQuery()
      // this.$analytics.event('Search - Query', {
      //   term: this.query.term,
      //   types: this.query.types
      // })
    },
    sendRequest() {
      // NOTE: This needs a little more smarts :P
      // // NOTE: If the types change, may need to update this restriction
      // if (this.query.term && this.query.term === this.previousQuery) return
      // reset all for this
      if (!this.query || !this.query.term || this.query.term.length < 1) {
        this.resetSearch()
        return
      }

      this.previousQuery = this.query.term
      this.request()
    },
    addNewBookmark() {
      // Check that the meat of the query exists, otherwise we can't eat
      if (!this.query || !this.query.term) return

      // get associated categories as well
      const cats = [].concat(this.categories)
      const types = cats
        .filter(c => c.active && c.type !== 'all')
        .map(c => c.type)

      // Rememberable
      const item = Object.assign({}, this.query)
      item.types = types
      item.timestamp = +new Date()
      item.results =
        this.results && this.results.totalRecords
          ? this.results.totalRecords
          : 0
      this.addBookmark(item)
      // this.$analytics.event('Search - Add Bookmark', item)
    },
    addRecentSearch() {
      let searches = window.localStorage.getItem('searches')

      // If null set it to default value of empty array
      searches = searches ? searches : '[]'
      searches = JSON.parse(searches)
      searches.push(this.query.term)
      window.localStorage.setItem('searches', JSON.stringify(searches))
    }
  },

  mounted() {
    // set previously used query
    if (this.query && this.query.term) {
      this.previousQuery = this.query.term
    }

    let i = 0
    setInterval(() => {
      ++i
      if (i >= rotatingExamples.length) i = 0
      this.placeholder = !this.initial
        ? rotatingExamples[i]
        : this.placeholderHint
    }, 2000)
  },

  watch: {
    categories() {
      const activeTypes = this.categories.filter(c => c.active)
      if (
        this.query.types &&
        this.query.types.length === activeTypes.length - 1
      )
        return
      this.request()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables';

.smart-input {
  color: $black;
  display: flex;
  padding: 0;
  width: 60vw;
  height: 62px;
  margin: 30vh auto 0;
  position: relative;
}

.logo {
  height: 100%;
  width: 15vw;
}

.input-hodler {
  position: relative;
  display: flex;
  flex: 1;
}

.gothere {
  display: flex;
  position: absolute;
  right: 0;

  .go-action {
    cursor: pointer;
    margin: auto;
    opacity: 0;
    transition: all 220ms ease-in-out;

    &.active {
      opacity: 0.7;

      &:hover {
        opacity: 1;
      }
    }
  }

  .btn-img {
    width: 70px;
  }
}

// Tablet
// @media screen and (min-width: $tablet) and (max-width: $desktop - 1px) {
//
// }

// Mobile
@media screen and (max-width: $tablet - 1px) {
  .smart-input {
    flex-direction: column;
    width: 100%;
    height: 90px;
    margin: 15vh auto 0;

    .logo {
      height: auto;
      width: 100px;
      min-width: 100px;
      margin: 0 auto;
    }
  }

  .gothere {
    bottom: 0;
    right: 10px;
    height: 60px;

    .btn-img {
      width: 50px;
    }
  }
}
</style>
