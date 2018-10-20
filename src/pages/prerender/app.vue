<template lang="pug">
  #root
    h1=title
    el-tabs(v-model="activeTab")
      el-tab-pane(:label="$t('tab1')", name="module1")
        p {{$t('tab1Text')}}
      el-tab-pane(:label="$t('tab2')", name="module2")
        p {{$t('tab2Text')}}
</template>

<style lang="stylus" scoped>
#root
  padding: 100px
</style>

<script>
  import MessageMixin from "mixin/message"

  export default {
    i18n: {
      messages: {
        "en-US": {
          "title": "Prerender Demo",
          "tab1Text": "Text in tab1",
          "tab2Text": "Text in tab2",
          "tab1": "tab1",
          "tab2": "tab2",
        },
        "zh-CN": {
          "title": "预渲染示例",
          "tab1Text": "文本1",
          "tab2Text": "文本2",
          "tab1": "标签1",
          "tab2": "标签2",
        }
      }
    },
    name: 'prerender',
    mixins: [MessageMixin],
    components: {

    },
    data () {
      return {
        activeTab: 'module1'
      }
    },
    mounted () {
    },
    methods: {
    }
  }
</script>
