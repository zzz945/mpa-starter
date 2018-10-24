/* eslint-disable */
import { pageInit } from 'mpa-common-library/utils/_page-common.js'

import PasswordInput from 'mpa-common-library/components/password-input/index.vue'

import {validatePhone, validateEmail, validatePassword} from 'mpa-common-library/utils/_validator.js'
import api from 'api/_login.api.js'
import MessageMixin from "mpa-common-library/mixin/message"
import './index.styl'

pageInit ({
  vue: {
    name: 'Login',
    mixins: [MessageMixin],
    components: {
      PasswordInput
    },
    data () {
      return {
        user: {
          username: '',
          pswd: '',
        },
        rules: {
          account: {
            validator: (rule, value, cb) => {
              if (value && (validatePhone(value) || validateEmail(value))) cb()
              else cb(new Error('Account is not valid'))
            }
          },
          pswd: {
            validator: (rule, value, cb) => {
              if (!value || !validatePassword(value)) {
                cb(new Error('Password is not valid'))
              }
              cb()
            }
          },
        }
      }
    },
    methods: {
      handleLogin () {
        this.$refs.form.validate(valid => {
          if (!valid) return
          api.isRegistered({
            account: this.user.account
          }).then(registered => {
            if (registered) {
              return api.login(this.user).then(_ => location.href = '/')
            } else {
              this.$error('Not registered')
            }
          }).catch(this.$apiError)
        })
      },
      handleWechatLogin () {

      },
      handleFacebookLogin () {

      }
    }
  }
})
