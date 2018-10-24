<template lang="pug">
  .component-i18n
    p {{$t('greeting')}}
    <br><br>
    el-button(type="primary", @click="setLocale('en-US')") en-us
    el-button(type="primary", @click="setLocale('zh-CN')") zh-cn
</template>

<style lang="stylus" scoped>
p
  color: blue
  font-size: 32px
.zh-CN .component-i18n p
  color: red
</style>

<script>
  import { changeLocale } from 'mpa-common-library/utils/i18n'

  export default {
    i18n: {
      messages: {
        "en-US": {
          "greeting": "Hello Vue(Text in component can't be crawled by search engines)"
        },
        "zh-CN": {
          "greeting": "你好 Vue(组件中的文本不能被搜索引擎抓取)"
        }
      }
    },
    name: 'component-i18n',
    mixins: [],
    components: {
    },
    mounted () {
    },
    methods: {
      setLocale (locale) {
        changeLocale(locale)
      }
    }
  }
</script>
