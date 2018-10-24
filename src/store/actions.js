import axios from 'axios'
// import { apiPrefs } from '../../utils/helpers'
import filters from '../utils/filters'

const defaultCat = {
  active: true,
  name: 'All Categories',
  type: 'all'
}

const alphabetical = (a, b) => {
  if (a.type < b.type) return -1
  if (a.type > b.type) return 1
  return 0
}

const filterQueryData = (data, init = {}) => {
  const query = Object.assign({}, init, data)
  query.term = `${filters.removeSpecialChars(data.term)}`
  return query
}

const isAbsoluteURLRegex = /^(?:\w+:)\/\//

const authInterceptor = function(config) {
  if (typeof window === 'undefined') return config
  const isProduction = true

  // convenience method, adds main config route if we use shortcut
  if (!isAbsoluteURLRegex.test(config.url)) {
    // Changes to current network selection!
    const blockchainId = '1c9c969065fcd1cf'
    const serverUrl =
      isProduction && blockchainId
        ? `https://${blockchainId}.api.wb3.io`
        : 'http://localhost:7777'

    config.url = serverUrl + config.url
    if (blockchainId) config.headers['x-amberdata-blockchain-id'] = blockchainId
  }

  return config
}

axios.interceptors.request.use(authInterceptor)

export default {
  updateKeyValue({ commit }, { key, value }) {
    commit('UPDATE_KEYVALUE', { key, value })
  },

  toggleRefine({ commit }) {
    commit('TOGGLE_REFINE')
  },

  cancelSearch({ dispatch }) {
    dispatch('resetSearch')
  },

  resetSearch({ commit, state }) {
    let types = state.categories
    types = types
      .map(i => {
        i.active = true
        return i
      })
      .sort(alphabetical)
    types.unshift(defaultCat)
    commit('UPDATE_STATE', { key: 'results', value: {} })
    commit('UPDATE_STATE', {
      key: 'query',
      value: {
        size: 100,
        term: null,
        types
      }
    })
  },

  // Search entire blockchain!!
  postQuery({ commit, state }) {
    const cats = [].concat(state.categories)
    const types = cats
      .filter(c => c.active && c.type !== 'all')
      .map(c => c.type)
    const data = Object.assign({}, filterQueryData(state.query))
    data.types = types

    if (
      state.query.types &&
      data.types.length > 0 &&
      data.types.length !== state.query.types.length
    ) {
      commit('UPDATE_STATE', { key: 'query', value: data })
    }

    // make extra sure size is number
    data.size = Number(data.size)

    return axios({
      method: 'POST',
      url: '/search/query',
      data
    }).then(res => {
      if (res.data) {
        const results = res.data
        if (!results.records || results.records <= 0) {
          // clear results
          commit('UPDATE_STATE', { key: 'results', value: {} })
          return
        }

        // Sort and assign type name
        const filtered = results.records.sort(alphabetical).map(r => {
          cats.forEach(c => {
            if (r.type === c.type) r.name = c.name
          })
          return r
        })

        const fin = Object.assign({}, results, { records: filtered })
        commit('UPDATE_STATE', { key: 'results', value: fin })
      }
    })
  },

  // Search only relevent indexes
  getLookahead(context, query) {
    return axios({
      method: 'POST',
      url: '/search/lookahead',
      data: {
        term: query.term,
        types: query.categories
      }
    })
  },

  // Retrieves search types available
  getCategories({ commit }) {
    return axios.get('/search/types').then(res => {
      if (res.data && res.data.length > 0) {
        const items = res.data
        const arr = items
          .map(i => {
            i.active = true
            return i
          })
          .sort(alphabetical)
        arr.unshift(defaultCat)
        commit('UPDATE_STATE', { key: 'categories', value: arr })
      }
    })
  },

  updateCategories({ commit }, arr) {
    commit('UPDATE_STATE', { key: 'categories', value: arr })
  },

  // Gets latest and greats search trends #awwwyeahhh
  getTrending({ commit }) {
    return axios.get('/search/trends?numQueries=21').then(res => {
      if (res.data && res.data.length > 0) {
        const arr = res.data.filter(r => r.query !== 'undefined')
        commit('UPDATE_STATE', { key: 'trending', value: arr })
      }
    })
  },

  setSearchQuery({ commit, state }, data) {
    commit('UPDATE_STATE', {
      key: 'query',
      value: filterQueryData(data, state.query)
    })
    if (data && data.types) commit('ACTIVE_CATEGORIES', data.types)
    if (data && data.types && data.types[0] === '')
      commit('ACTIVATE_ALL_CATEGORIES')
  },

  addBookmark({ commit }, item) {
    commit('PUSH_BOOKMARK', item)
    // const data = {}
    // data[item.term] = item
    // return apiPrefs({
    //   method: 'POST',
    //   data,
    //   key: 'search.bookmarks',
    //   subKey: item.term
    // }).catch(() => ({
    //   message: 'Could not create new bookmark'
    // }))
  },

  removeBookmark({ commit }, item) {
    commit('DELETE_BOOKMARK', item)
    // return apiPrefs({
    //   method: 'DELETE',
    //   key: 'search.bookmarks',
    //   subKey: item.term
    // }).catch(() => ({
    //   message: 'Could not delete bookmark'
    // }))
  },

  getBookmarks({ commit }) {
    commit('SET_BOOKMARKS', {})
    // apiPrefs({
    //   method: 'GET',
    //   key: 'search.bookmarks'
    // }).then(response => commit('SET_BOOKMARKS', response.data))
  }
}
