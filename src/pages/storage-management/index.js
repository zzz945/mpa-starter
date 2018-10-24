/* eslint-disable */
import { pageInit } from 'mpa-common-library/utils/_spa-common.js'
import './index.styl'
import { cookie, local, session } from 'mpa-common-library/utils/_storage.js'

pageInit({
  vue: {
    name: 'storage-management',
    mounted () {
      cookie.set('test', 'test')
      local.set('test', 'test')
      session.set('test', 'test')
      console.log('cookie(test)', cookie.get('test'))
      console.log('local(test)', local.get('test'))
      console.log('session(test)', session.get('test'))
    }
  },
})