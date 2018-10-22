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

    <div class="copypasta">
      <!-- todo -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TypeAhead from './TypeAhead'

const hints = {
  0: 'Search for Tokens, Contracts, Addresses, Transactions, Blocks...',
  1: 'Hit Enter to select item, use Arrow Keys to navigate search items'
}

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
      searchQuery: '',
      timer: null,
      queryTerm: '',
      placeholder: rotatingExamples[0],
      previousQuery: '',
      previousTypes: [],
      activeHint: hints[0]
    }
  },

  computed: {
    ...mapGetters([
      'bookmarks',
      'categories',
      'query',
      'refineActive',
      'results'
    ]),
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
      'toggleRefine',
      'updateKeyValue'
    ]),
    close() {
      this.toggleActive()
      this.$analytics.event('Search - Query Close')
    },
    toggleRefinements() {
      this.toggleRefine()
      this.$analytics.event('Search - Toggle Refine', {
        active: this.refineActive
      })
    },
    handleSelect(data) {
      this.setSearchQuery({ term: data.term })
      this.sendRequest()
      this.updateKeyValue({ key: 'tmpTerm', value: data.term })
    },
    handleInput(term) {
      if (!term || term.length < 1) {
        this.resetSearch()
        this.updateKeyValue({ key: 'tmpTerm', value: null })
      }
      this.activeHint = term && term.length > 0 ? hints[1] : hints[0]
      this.updateKeyValue({ key: 'tmpTerm', value: term })
    },
    request() {
      // Very minor checks, then start
      if (!this.query || !this.query.term || this.query.term.length < 1) return
      if (this.query.term === 'undefined' || this.query.term === undefined)
        return

      this.$event.$emit('LOADING:SHOW', { title: 'Searching...' })
      this.postQuery()
        .then(() => {
          this.$event.$emit('LOADING:HIDE')
        })
        .catch(() => {
          this.$event.$emit('LOADING:HIDE')
        })

      this.$analytics.event('Search - Query', {
        term: this.query.term,
        types: this.query.types
      })

      // catchall
      if (this.timer && process.browser) window.clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$event.$emit('LOADING:HIDE')
      }, 30000)
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
      // User must be authed, otherwise this feature is useless
      if (!this.isAuthenticated) {
        this.$event.$emit('AUTH:REQUIRES:SESSION', { type: 'login' })
        return
      }

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

      this.$analytics.event('Search - Add Bookmark', item)
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
      this.placeholder = rotatingExamples[i]
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
</style>
