<template lang="pug">
  el-form(ref="form", :model="user")
    el-form-item(
      label="Name",
      prop="name"
    )
      el-input(v-model="user.name", placeholder="Name")
    el-form-item(
      prop="age",
      label="Age",
      :rules="validationRules.age",
    )
      el-input(v-model="user.age", placeholder="Age")
    el-form-item(
      prop="phone",
      label="Phone",
      :rules="validationRules.phone",
    )
      el-input(v-model="user.phone", placeholder="Phone")
    el-form-item(
      prop="email",
      label="Email",
      :rules="validationRules.email",
    )
      el-input(v-model="user.email", placeholder="Email")
    el-button(type="primary", @click="handleAdd") Add
</template>

<script>

import MessageMixin from "mpa-common-library/mixin/message"
import validationRules from '../validation-rules.js'
import api from 'api/_add-edit-search.api.js'

export default {
  name: 'Add',
  mixins: [MessageMixin],
  components: {
  },
  data () {
    return {
      user: {
        name: '',
        age: '',
        phone: '',
        email: ''
      },
      validationRules
    }
  },
  methods: {
    handleAdd () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        api.add(this.user).then(res => {
          this.$success('add success').then(_ => {
            this.$router.push(`/add-edit-search/edit/${res.id}`)
          })
        }).catch(this.$apiError)
      })
    }
  }
}
</script>