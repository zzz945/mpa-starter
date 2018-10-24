/* eslint-disable */
import { pageInit } from 'mpa-common-library/utils/_page-common.js'
import { lazyloadInit } from 'mpa-common-library/utils/lazyload'
import MessageMixin from "mpa-common-library/mixin/message"
import './index.styl'

pageInit ({
  vue: {
    name: 'lasyload',
    mixins: [MessageMixin],
    components: {
    },
    mounted () {
      lazyloadInit()
    }
  }
})
