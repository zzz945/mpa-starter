<template lang="pug">
  el-tabs#root(v-model="activeTab")
    el-tab-pane(label="Module 1", name="module1")
      async-component1(v-if="activeTab === 'module1'")
    el-tab-pane(label="Module 2", name="module2")
      async-component2(v-if="activeTab === 'module2'")
</template>

<style lang="stylus" scoped>
#root
  padding: 100px
</style>

<script>
  import MessageMixin from "mpa-common-library/mixin/message"

  export default {
    name: 'dynamic-import',
    mixins: [MessageMixin],
    components: {
      'async-component1': () => import(/* webpackChunkName: "async-component1" */'./async-component1.vue'),
      'async-component2': () => import(/* webpackChunkName: "async-component2" */'./async-component2.vue'),
    },
    data () {
      return {
        activeTab: 'module1'
      }
    },
    watch: {
      activeTab () {
        import(/* webpackChunkName: "dynamic-module" */'./dynamic-module.js').then(({ default: sayHello }) => {
          sayHello(this.$info)
        })
      }
    },
    mounted () {
    },
    methods: {
    }
  }
</script>
