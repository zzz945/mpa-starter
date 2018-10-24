<template lang="pug">
  el-form(ref="form", :model="user")
    .edit-btn-wrapper
      el-button(v-if="!editing", type="primary", @click="handleEdit") Edit
      el-button(v-else, type="primary", @click="handleCancel") Cancel
    el-form-item(
      label="Name",
      prop="name"
    )
      el-input(v-model="user.name", placeholder="Name", :disabled="!editing")
    el-form-item(
      prop="age",
      label="Age",
      :rules="validationRules.age",
    )
      el-input(v-model="user.age", placeholder="Age", :disabled="!editing")
    el-form-item(
      prop="phone",
      label="Phone",
      :rules="validationRules.phone",
    )
      el-input(v-model="user.phone", placeholder="Phone", :disabled="!editing")
    el-form-item(
      prop="email",
      label="Email",
      :rules="validationRules.email",
    )
      el-input(v-model="user.email", placeholder="Email", :disabled="!editing")
    el-button(type="primary", :disabled="!editing", @click="handleSave") Save
</template>

<script>

import MessageMixin from "mpa-common-library/mixin/message"
import validationRules from '../validation-rules.js'
import api from 'api/_add-edit-search.api.js'

export default {
  name: 'Edit',
  mixins: [MessageMixin],
  components: {
  },
  data () {
    return {
      user: {},
      editing: false,
      validationRules
    }
  },
  mounted () {
    api.getItem(this.$route.params.id).then(user => this.user = user).catch(this.$apiError)
  },
  methods: {
    handleEdit () {
      this.editing = true
    },
    handleSave () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        api.update(this.user).then(_ => {
          this.$success('update success').then(_ => {
            this.editing = false
          })
        }).catch(this.$apiError)
      })
    },
    handleCancel () {
      this.editing = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.edit-btn-wrapper
  text-align right
</style>