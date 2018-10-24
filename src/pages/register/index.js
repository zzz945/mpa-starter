/* eslint-disable */
import { pageInit } from 'mpa-common-library/utils/_page-common.js'
import './index.styl'

import EmailRegister from './email-register.vue'
import PhoneRegister from './phone-register.vue'
import MessageMixin from "mpa-common-library/mixin/message"

const TYPE_PHONE = '1'
const TYPE_EMAIL = '2'

pageInit ({
  vue: {
    name: 'Register',
    mixins: [MessageMixin],
    components: {
      EmailRegister,
      PhoneRegister,
    },
    data () {
      return {
        type: $LB.query.type || TYPE_PHONE,
        TYPE_PHONE,
        TYPE_EMAIL,
      }
    },
    watch: {
      type () {
        location.href = '/register?type=' + this.type
      }
    },
    methods: {
      handleWechatLogin () {
      },
      handleFacebookLogin () {

      }
    }
  }
})
