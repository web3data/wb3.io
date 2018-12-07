export default {
  UPDATE_KEYVALUE(state, { key, value }) {
    // NOTE: Only used when super lazy/super sure its not important
    state[key] = value
  },

  UPDATE_STATE(state, { key, value }) {
    state[key] = value
  },

  TOGGLE_REFINE(state) {
    state.refineActive = !state.refineActive
  },

  ACTIVE_CATEGORIES(state, arr) {
    state.categories = state.categories.map(c => {
      c.active = arr.join(',').includes(c.type) ? true : false
      return c
    })

    // Lastly, check if all are active, toggle all categories
    // NOTE: Important! This has nothing to do with Felis catus
    const catTest = [].concat(state.categories)
    catTest.shift()
    const allTrue = catTest.every(m => {
      return m.active == true
    })
    state.categories[0].active = allTrue === true
  },

  ACTIVATE_ALL_CATEGORIES(state) {
    if (!state.categories || state.categories.length <= 0) return
    state.categories = state.categories.map(c => {
      c.active = true
      return c
    })
  },

  PUSH_BOOKMARK(state, item) {
    let prevIdx

    // Check if same query term exists, if so, update bookmark
    state.bookmarks.forEach((b, idx) => {
      if (b.term && item.term && b.term === item.term) prevIdx = idx
    })

    if (typeof prevIdx !== 'undefined') {
      state.bookmarks[prevIdx] = item
    } else {
      state.bookmarks.push(item)
    }
  },

  DELETE_BOOKMARK(state, item) {
    if (!item || !item.term) return
    state.bookmarks.forEach((b, idx) => {
      if (b.term === item.term) {
        state.bookmarks.splice(idx, 1)
      }
    })
  },

  SET_BOOKMARKS(state, bookmarks) {
    if (!bookmarks || bookmarks.length <= 0) return
    state.bookmarks = bookmarks.map(item => {
      let term = Object.keys(item)[0]
      if (typeof item[term] === 'string') {
        return JSON.parse(item[term])
      }
      return item[term]
    })
  },

  ADD_SEARCH(state, { term, url }) {
    state.searches.unshift({ term: term, url: url })

    // if (!state.searches.includes(search)) {
    //   state.searches.push({ term: state.query.term, url: url })
    //   window.localStorage.setItem('searches', JSON.stringify(state.searches))
    // }
  },

  SET_SEARCH(state, searches) {
    state.searches = searches
  }
}
