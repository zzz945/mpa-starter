<template lang="pug">
  el-form.email-login(ref="form", :model="user")
    el-form-item(
      prop="email",
      :rules="rules.email",
    )
      el-input(
        v-model="user.email",
        name="email",
        type="text",
        auto-complete="email",
        placeholder="Email",
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
    el-button.login-btn(type="primary", @click="handleEmailRegister") Register
</template>

<style lang="stylus" scoped>
  .login-btn
    float right
</style>

<script>

import PasswordInput from 'mpa-common-library/components/password-input/index.vue'
import {validateEmail, validatePassword} from 'mpa-common-library/utils/_validator.js'
import api from 'api/_register.api.js'
import MessageMixin from "mpa-common-library/mixin/message"

export default {
  name: 'email-register',
  mixins: [MessageMixin],
  components: {
    PasswordInput,
  },
  data () {
    return {
      user: {
        username: '',
        email: '',
        pswd: '',
        repswd: '',
        code: '',
      },
      isExist: true,
      rules: {
        email: {
          validator: (rule, value, cb) => {
            if (!value || !validateEmail(value)) {
              cb(new Error('Email is not valid'))
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
            if (value && validatePassword(value)) cb()
            else if (value !== this.user.pswd) cb(new Error('Two passwords are different'))
            else cb(new Error('Password is not valid'))
          }
        },
      }
    }
  },
  mounted () {
  },
  methods: {
    handleEmailRegister () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        api.isRegistered({
          email: this.user.email
        }).then(registered => {
          if (!registered) {
            return api.register(this.user).then(_ => location.href = '/')
          } else {
            this.$error('Not registered')
          }
        }).catch(this.$apiError)
      })
    }
  }
}
</script>
