<template>
  <div :class="{'collapse-card': true, open}">
    <div class="collapse-header" @click.prevent="open = !open">
      <p>{{ title }}</p>
      <img src="/static/chevron-up.svg" alt="">
    </div>
    <div class="collapse-content">
      <p v-html="content"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CollapseCard',
  data() {
    return {
      open: false
    }
  },
  props: ['title', 'content'],
  computed: {},
  methods: {}
}
</script>
<style lang="sass" scoped>
@import '../scss/variables.scss'

.collapse-card
  background: $white
  border-radius: 3px
  border: 1px solid rgba(0,0,0,0.1)
  box-shadow: 0 2px 10px -2px transparentize($black, .85)
  font-size: 10pt
  margin-top: 10px
  &.open
    > .collapse-content
      max-height: 10000px
      padding-bottom: 15px
    > .collapse-header
        img
          transform: none
  .collapse-header
    height: 40px
    padding: 0 15px
    cursor: pointer
    display: flex
    flex-flow: row nowrap
    align-items: center
    justify-content: space-between
    img
      width: 14px
      transform: rotate(180deg)
  .collapse-content
    max-height: 0
    overflow: hidden
    transition: max-height 260ms ease-in-out
    padding: 0 15px 0 15px
    p
      border-top: 1px solid #E5E5E5
      padding-top: 15px
</style>
