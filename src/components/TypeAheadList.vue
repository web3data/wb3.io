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
  <div class="typeahead-list">
    <ul>
      <li v-for="(item, i) in data">
        <div v-if="item.all" class="list-item-cont" @click.prevent="selectItem(item)" @mousemove="mousemove(i)">
          <div class="typeahead-list-item typeahead-list-all" :class="activeClass(i)">
            <h2>Search all matches for "{{ model }}"</h2>
          </div>
        </div>
        <div v-else class="list-item-cont" @click.prevent="selectItem(item)" @mousemove="mousemove(i)">
          <TypeAheadListItem :class="activeClass(i)" :data="formatItem(item)" :model="model" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import TypeAheadListItem from './TypeAheadListItem'

export default {
  name: 'TypeAheadList',

  props: ['data', 'model', 'activeIndex', 'selectItem', 'mousemove'],

  components: {
    TypeAheadListItem
  },

  methods: {
    activeClass(i) {
      return i === this.activeIndex ? 'focus-list' : ''
    },
    formatItem(item) {
      if (!item || !item.match) return item
      if (item && item.match) {
        // Moved ERC spec booleans up to parent so that the UI can display better.
        // Child template is extremely generic, and removes ERC data
        if (item.match.isERC20 === 'true' || item.match.isERC20 === true)
          item.isERC20 = true
        if (item.match.isERC721 === 'true' || item.match.isERC721 === true)
          item.isERC721 = true
      }
      return item
    }
  }
}
</script>

<style lang="sass">
// @import "../assets/sass/mq"
@import "../scss/variables"

.typeahead-list
  left: 0
  position: absolute
  top: 62px
  transition: all 0.3s ease-out
  width: 100%
  z-index: 10

.typeahead-list ul
  background: $white
  box-shadow: 0 1px 10px -2px rgba(0,0,0,0.1)
  border-radius: 0 0 3px 3px
  display: inline-block
  list-style: none
  overflow: scroll
  max-height: calc(70vh - 62px)
  margin: 0
  padding: 0
  // position: absolute
  width: 100%

.search-my-dashboard ul
  li:first-child
    display: none

  // +mobile
  //   max-height: calc(100vh - 150px)

  li .list-item-cont
    padding: 0

</style>
