export default {
  UPDATE_KEYVALUE(state, { key, value }) {
    // NOTE: Only used when super lazy/super sure its not important
    state[key] = value
  }
}
