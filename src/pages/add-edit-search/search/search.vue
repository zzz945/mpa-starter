<template lang="pug">
  extends ../../../mpa-common-library/mixin/search/index

  block querybar-form-items
    el-form-item(
      prop="name"
    )
      el-input(v-model="queryParams.name", placeholder="Name")
    el-form-item(
      prop="age",
      :rules="queryParamRules.age",
    )
      el-input(v-model="queryParams.age", placeholder="Age")
    el-form-item(
      prop="phone",
      :rules="queryParamRules.phone",
    )
      el-input(v-model="queryParams.phone", placeholder="Phone")
    el-form-item(
      prop="email",
      :rules="queryParamRules.email",
    )
      el-input(v-model="queryParams.email", placeholder="Email")
  block table-columns
    el-table-column(label="ID", prop="id")
      template(slot-scope="scope")
        a(href="javascript;", @click="$route.push('/add-edit-search/edit?disabled=true')") {{scope.row.id}}
    el-table-column(label="Name", prop="name")
    el-table-column(label="Age", prop="age")
    el-table-column(label="Phone", prop="phone")
    el-table-column(label="Email", prop="email")
</template>

<style lang="stylus" scoped>
@import '~mpa-common-library/mixin/search/index.styl'
</style>

<script>

import SearchMixin from 'mpa-common-library/mixin/search'
import api from 'api/_add-edit-search.api.js'
import validationRules from '../validation-rules.js'

export default {
  name: 'Search',
  mixins: [SearchMixin],
  data () {
    return {
      loading: false,
      queryParamRules: validationRules
    }
  },
  methods: {
    searchImpl (curPage, pageSize, params) {
      return api.search(curPage, pageSize, params)
    },
    deleteImpl (item) {
      return this.$confirm(`Are you sure to delete ${item.name}?`).then(act => {
        if (act === 'cancel') return
        return api.delete(item.id)
      })
    },
  }
}
</script>
