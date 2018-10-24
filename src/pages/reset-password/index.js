/* eslint-disable */
import { pageInit } from 'mpa-common-library/utils/_page-common.js'
import './index.styl'

import PasswordInput from 'mpa-common-library/components/password-input/index.vue'
import api from 'api/_login.api.js'
import MessageMixin from "mpa-common-library/mixin/message"

import {validatePhone, validateEmail, validatePassword} from 'mpa-common-library/utils/_validator.js'

pageInit ({
  vue: {
    name: 'ResetPassword',
    mixins: [MessageMixin],
    components: {
      PasswordInput,
    },
    data () {
      return {
        activeTab: 'phone',
        user: {
          phone: '',
          email: '',
          pswd: '',
          repswd: '',
          code: '',
        },
        rules: {
          phone: {
            validator: (rule, value, cb) => {
              if (value && validatePhone(value)) cb()
              else cb(new Error('Phone is not valid'))
            }
          },
          email: {
            validator: (rule, value, cb) => {
              if (value && validateEmail(value)) cb()
              else cb(new Error('Email is not valid'))
            }
          },
          pswd: {
            validator: (rule, value, cb) => {
              if (value && validatePassword(value)) cb()
              else cb(new Error('Password is not valid'))
            }
          },
          validator: (rule, value, cb) => {
            if (value) {
              if (!validatePassword(value)) cb(new Error('Password is not valid'))
              else if (value !== this.user.pswd) cb(new Error('Two passwords are different'))
              else cb()
            } else cb(new Error('Password is not valid'))
          }
        }
      }
    },
    methods: {
      sendCodeByPhone () {
        this.$refs.phoneForm.validate(valid => {
          if (!valid) return
          api.sendCodeByPhone({
            phone: this.user.phone
          }).then(_ => {
            this.$success('send success')
          }).catch(this.$apiError)
        })
      },
      sendCodeByEmail () {
        this.$refs.emailForm.validate(valid => {
          if (!valid) return
          api.sendCodeByEmail({
            phone: this.user.phone
          }).then(_ => {
            this.$success('send success')
          }).catch(this.$apiError)
        })
      },
      resetPassword () {
        this.$refs.pswdForm.validate(valid => {
          if (!valid) return
          api.resetPassword(this.user).then(_ => {
            this.$success('send success').then(_ => location.href = '/login')
          }).catch(this.$apiError)
        })
      }
    }
  }
})
