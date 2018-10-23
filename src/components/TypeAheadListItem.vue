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
  <div class="typeahead-list-item">
    <!-- <div class="item-icon-wrap">
      <icon v-if="data && data.type != 'token'" :name="getIcon(data.type)" />
      <Blockie v-if="data && data.type == 'token'" :hex="data.match.address" />
    </div> -->

    <div class="ta-item-wrap">
      <div class="ta-title-container">
        <h2 v-html="preferredMatch" />
      </div>
      <div class="item-subdetails">
        <span v-if="data && data.isERC20" class="tag typeahead-label">ERC20</span>
        <span v-if="data && data.isERC721" class="tag typeahead-label">ERC721</span>
        <span class="tag typeahead-label">{{ data.type }}</span>
        <span v-for="m in matches" :class="getClass(m.key)" v-html="stringMatch(m.value)" />
      </div>
    </div>

    <!-- <div class="item-end-wrap">
      <icon name="star" />
    </div> -->

    <!-- <span class="tag typeahead-label">
      <icon v-if="data && data.type != 'token'" :name="getIcon(data.type)" />
      {{ data.type }}
    </span> -->

  </div>
</template>

<script>
import filters from '../utils/filters'

export default {
  name: 'TypeAheadListItem',
  props: ['data', 'model'],

  computed: {
    preferredMatch() {
      // absolute worst case handler
      if (!this.data || !this.data.match) return this.data.type || ''

      const match = this.data.match
      const num = match.number ? filters.addCommas(match.number) : null
      const blockNum = match.blockNumber
        ? filters.addCommas(match.blockNumber)
        : null
      let title

      switch (this.data.type) {
        case 'token':
          title = match.name || match.symbol || match.address
          break
        case 'block':
          title = num
          break
        case 'uncle':
          title = blockNum
          break
        case 'transaction':
          title = filters.hashShorten(match.hash, 24)
          break
        case 'log':
          title = blockNum
          break
      }

      return title
    },
    matches() {
      if (!this.data || !this.data.match || this.data.match.length <= 0)
        return []
      let arr = []

      Object.keys(this.data.match).forEach(m => {
        arr.push({
          key: m,
          value: this.data.match[m]
        })
      })

      arr = arr
        .sort((a, b) => {
          if (a.value.length < b.value.length) return -1
          if (a.value.length > b.value.length) return 1
          return 0
        })
        .filter(a => a.key !== 'isERC20' && a.key !== 'isERC721')

      return arr
    }
  },

  methods: {
    getFilter(str) {
      let filter
      if (str && !isNaN(str)) filter = 'addCommas'
      if (str && (`${str}`.search('0x') > -1 || str.length > 21))
        filter = 'hashShorten'

      return filter ? filter : null
    },
    // Looks for matches within a string, adds bolding where string is direct match
    stringMatch(str) {
      const filter = this.getFilter(str)
      const s = filter ? filters[filter](str, 24) : str
      if (typeof s !== 'string') return
      const mdl = filter ? filters[filter](this.model, 24) : this.model
      const rgx = new RegExp(`(${mdl})`, 'ig')

      return s.replace(rgx, '<b>$1</b>')
    },
    getClass(type) {
      return `ta-type-${type}`
    },
    getIcon(type) {
      let icon = ''

      switch (type) {
        case 'block':
          icon = 'cube'
          break
        case 'uncle':
          icon = 'cubes'
          break
        case 'transaction':
          icon = 'document'
          break
        case 'log':
          icon = 'file-code-o'
          break
        default:
          icon = 'globe'
          break
      }
      return icon
    }
  }
}
</script>

<style lang="sass">
// @import "../assets/sass/mq"
@import "../scss/variables"

.typeahead-list-item
  border-bottom: 1px solid transparentize($black, .95)
  color: $grey03
  cursor: pointer
  display: flex
  padding: 0

  &.typeahead-list-all
    h2
      color: $black
      display: block
      width: 100%
      font-style: italic
      margin: $gutter 0
      text-align: center

  .ta-item-wrap
    display: flex
    flex-direction: column
    padding: 10px 20px
    // max-width: 80%

  .item-subdetails
    line-height: 8pt

  .typeahead-label
    border: 1px solid transparentize($black, .9)
    background: $grey08
    color: $grey05
    height: initial
    font-size: 7pt
    font-weight: 500
    text-transform: uppercase
    margin: 0 2px 0 0
    padding: 0 3px

  .ta-title-container
    display: flex
    min-width: 0
    max-width: 500px

    h2
      color: $black
      font-size: 16pt
      line-height: 17pt
      padding: 1px 0 4px
      margin: 0
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap

  span
    color: $grey05
    font-size: 9pt
    margin: auto 3px

    b
      color: $grey02

  // .item-icon-wrap
  //   display: flex
  //   margin: auto 5px
  //   width: 40px
  //   height: 40px
  //   border-radius: 5px
  //   overflow: hidden
  //
  //   .blockie img
  //     width: 40px
  //     height: 40px
  //
  //   .fa-icon
  //     height: 25px
  //     margin: auto
  //     width: 25px

  &.focus-list
    color: white
    background: #2F9AF7

    span
      color: $grey03

    .typeahead-label
      color: $grey05

  // +mobile
  //   .fa-icon,
  //   span + span + span
  //     display: none
  //
  //   .icon-wrap
  //     width: 0
  //
  //   h2
  //     font-size: 11pt
  //
  //   span
  //     max-width: 30vw
  //     text-overflow: ellipsis
  //     white-space: nowrap
  //     overflow: hidden
  //
  //   .typeahead-list-item
  //     span
  //       margin: auto 5px auto 0
  //
  //   .typeahead-label
  //     font-size: 8pt
  //     max-width: initial
  //     overflow: initial
  //     padding: 0 3px

</style>
