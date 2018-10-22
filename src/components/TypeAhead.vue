<!-- ===============================================================================================
   Copyright © 2017-2018 Amberdata, Inc.
   California, USA
   All rights reserved.

   This software (the "Software") is provided pursuant to the license agreement you entered into
   with Amberdata, Inc. (the "License Agreement"). The Software is the confidential and
   proprietary information of Amberdata, * Inc., and you shall use it only in accordance with the
   terms and conditions of the License Agreement.

   THE SOFTWARE IS PROVIDED "AS IS" AND "AS AVAILABLE." AMBERDATA, INC. MAKES NO WARRANTIES OF
   ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES AND
   CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.

   ============================================================================================= -->

<template>
  <div class="typeahead-wrapper">
    <input
      ref="input"
      type="text"
      class="typeahead-input"
      :id="id"
      :placeholder="placeholder"
      v-model="type"
      @input="handleInput"
      @dblclick="handleDoubleClick"
      @blur="handleBlur"
      @keydown="handleKeyDown"
      @focus="handleFocus"
      autocomplete="off"
    >

    <div v-show="showList && results.length">
      <TypeAheadList :data="results" :model="type" :active-index="focusList" :select-item="selectList" :mousemove="mousemove" />
    </div>

  </div>
</template>

<script>
// Loosely based on vue2-autocomplete by Naufal Rabbani
// REF: https://github.com/BosNaufal/vue2-autocomplete

import { mapActions, mapGetters } from 'vuex'
import TypeAheadList from './TypeAheadList'

const keys = {
  DOWN: 40,
  UP: 38,
  ENTER: 13,
  ESC: 27
}

export default {
  name: 'TypeAhead',

  props: [
    'id',
    'name',
    'placeholder',
    'debounce',
    'textSync',

    // Callbacks
    'onSelect',
    'onDeselect',
    'onInput',
    'isActive'
  ],

  components: {
    TypeAheadList
  },

  data() {
    return {
      showList: false,
      type: '',
      results: [],
      focusList: '',
      debounceTask: undefined
    }
  },

  watch: {
    // receives all changes to query term
    textSync() {
      const value = typeof this.textSync == 'object' ? '' : this.textSync
      this.type = this.textSync == 'query.term' ? this.query.term : value
    }
  },

  computed: {
    ...mapGetters(['query'])
  },

  methods: {
    ...mapActions(['getLookahead']),

    // Neutralize Autocomplete
    clearInput() {
      this.showList = false
      this.type = ''
      this.results = []
      this.focusList = ''
      this.onDeselect()
    },

    // Checks all types of data for matching context, exclusive match only
    // NOTE: This is a preference, needs user verification to accurately guess behaviour desired
    getTermByType(type, str, match) {
      let term
      // Cannot use match.numberRaw or match.blockNumberRaw because in certain cases it is undefined, e.g., from block detail page.
      const stringifiedNumber = match.number ? match.number.toString() : null
      const stringifiedBlockNumber = match.blockNumber
        ? match.blockNumber.toString()
        : null
      switch (type) {
        case 'block':
          if (match.hash && match.hash.includes(str)) term = match.hash
          if (stringifiedNumber && stringifiedNumber.includes(str))
            term = stringifiedNumber
          break
        case 'uncle':
          if (match.hash && match.hash.includes(str)) term = match.hash
          if (stringifiedBlockNumber && stringifiedBlockNumber.includes(str))
            term = stringifiedBlockNumber
          break
        case 'transaction':
          if (match.to && match.to.includes(str)) term = match.to
          if (match.from && match.from.includes(str)) term = match.from
          if (match.hash && match.hash.includes(str)) term = match.hash
          if (stringifiedBlockNumber && stringifiedBlockNumber.includes(str))
            term = stringifiedBlockNumber
          break
        case 'log':
          if (stringifiedBlockNumber) term = stringifiedBlockNumber
          if (match.transactionHash) term = match.transactionHash
          break
        case 'token':
          if (match.address && match.address.includes(str)) term = match.address
          // name and symbol need special matching tests
          if (
            match.symbol &&
            `${match.symbol.toLowerCase()}`.includes(str.toLowerCase())
          )
            term = match.symbol
          if (
            match.name &&
            `${match.name.toLowerCase()}`.includes(str.toLowerCase())
          )
            term = match.name
          break
      }

      return term
    },

    // INPUT EVENTS
    // =============================
    handleInput(e) {
      const { value } = e.target
      this.showList = true
      // Callback Event
      if (this.onInput) this.onInput(value)
      // If Debounce
      if (this.debounce) {
        if (this.debounceTask !== undefined) clearTimeout(this.debounceTask)
        this.debounceTask = setTimeout(() => {
          return this.getData(value)
        }, this.debounce)
      } else {
        return this.getData(value)
      }
    },

    handleKeyDown(e) {
      let key = e.keyCode

      // Disable when list isn't showing up
      if (!this.showList) return

      // Prevent Default for Prevent Cursor Move & Form Submit
      switch (key) {
        case keys.DOWN:
          e.preventDefault()
          this.focusList++
          break
        case keys.UP:
          e.preventDefault()
          this.focusList--
          break
        case keys.ENTER:
          e.preventDefault()
          this.selectList(this.results[this.focusList])
          this.showList = false
          break
        case keys.ESC:
          this.clearInput()
          break
      }

      const listLength = this.results.length - 1
      const outOfRangeBottom = this.focusList > listLength
      const outOfRangeTop = this.focusList < 0
      const topItemIndex = 0
      const bottomItemIndex = listLength

      let nextFocusList = this.focusList
      if (outOfRangeBottom) nextFocusList = topItemIndex
      if (outOfRangeTop) nextFocusList = bottomItemIndex
      this.focusList = nextFocusList
    },

    setValue(val) {
      this.type = val
    },

    // LIST EVENTS
    // =============================

    handleDoubleClick() {
      this.results = []
      this.getData('')
      this.showList = true
    },

    handleBlur() {
      setTimeout(() => {
        this.showList = false
      }, 250)
    },

    handleFocus() {
      this.focusList = 0
    },

    mousemove(i) {
      this.focusList = i
    },

    selectList(data) {
      this.showList = false
      // Assign term, updated to the context of data item
      // OLD: const term = this.type
      let term

      if (data && data.match) {
        term = this.getTermByType(data.type, this.type, data.match)
        if (term) this.type = term
        if (!term) term = this.type
      } else {
        term = this.type
      }
      // Callback Event
      if (this.onSelect) this.onSelect({ term, data })
    },

    getData(value) {
      if (!value || value.length < 1) {
        this.showList = false
        return
      }
      let categories = []
      if (this.id === 'search-my-dashboard') {
        categories = ['address', 'token']
      }
      const query = {
        term: value,
        categories
      }
      this.getLookahead(query).then(res => {
        // Add default select all
        res.data.unshift({ all: true })
        this.results = res.data
      })
    }
  }
}
</script>

<style lang="sass">
@import "../scss/variables"

.typeahead-wrapper
  display: flex
  width: 100%

.typeahead-input
  background: transparent
  border: 0
  border-bottom: 4px solid $black
  font-size: 38pt
  line-height: 42pt
  outline: 0
  padding: 0 $gutter
  height: 58px
  width: 100%

  &.focus-input
    outline: 2px solid #96b2fe
</style>
