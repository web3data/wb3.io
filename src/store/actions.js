export default {
  updateKeyValue({ commit }, { key, value }) {
    commit('UPDATE_KEYVALUE', { key, value })
  }
}
