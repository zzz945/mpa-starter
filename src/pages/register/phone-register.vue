<template lang="pug">
  el-form.phone-login(ref="form", :model="user")
    el-form-item(
      prop="phone",
      :rules="rules.phone",
    )
      el-input(
        v-model="user.phone",
        name="mobile",
        type="text",
        auto-complete="phone",
        placeholder="Phone",
      )
    el-form-item(
      prop="username",
    )
      el-input(
        v-model="user.username",
        name="username",
        type="text",
        auto-complete="username",
        placeholder="User Name",
      )
    el-form-item(
      prop="pswd",
      :rules="rules.pswd",
    )
      password-input(
        v-model="user.pswd",
        autocomplete="new-password",
        placeholder="Password",
      )
    el-form-item(
      prop="repswd",
      :rules="rules.repswd",
    )
      password-input(
        v-model="user.repswd",
        name="repswd",
        autocomplete="new-password",
        placeholder="Re Password",
      )
    el-form-item(
      prop="code",
    )
      el-input(v-model="user.code", placeholder="Verification code")
    el-button.login-btn(type="primary", @click="handlePhoneRegister") Register
</template>

<style lang="stylus" scoped>
  .login-btn
    float right
</style>

<script>

import PasswordInput from 'mpa-common-library/components/password-input/index.vue'
import {validatePhone, validatePassword} from 'mpa-common-library/utils/_validator.js'
import api from 'api/_login.api.js'
import MessageMixin from "mpa-common-library/mixin/message"

export default {
  name: 'phone-register',
  mixins: [MessageMixin],
  components: {
    PasswordInput,
  },
  data () {
    return {
      user: {
        username: 'sdfsdf',
        phone: '',
        pswd: '',
        repawd: '',
        code: '',
      },
      rules: {
        phone: {
          validator: (rule, value, cb) => {
            if (!value || !validatePhone(value)) {
              cb(new Error('Phone is not valid'))
            }
            cb()
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
        repswd: {
          validator: (rule, value, cb) => {
            if (value) {
              if (!validatePassword(value)) cb(new Error('Password is not valid'))
              else if (value !== this.user.pswd) cb(new Error('Two passwords are different'))
              else cb()
            } else cb(new Error('Password is not valid'))
          }
        },
      }
    }
  },
  watch: {
    'user.phone' () {
      this.$refs.form.validateField('phone')
    },
  },
  mounted () {
  },
  methods: {
    handlePhoneRegister () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        api.isRegistered({
          phone: this.user.phone
        }).then(registered => {
          if (registered) {
            return api.login(this.user).then(_ => location.href = '/')
          } else {
            this.$error('Not registered')
          }
        }).catch(this.$apiError)
      })
    }
  }
}
</script>
