import axios from 'axios'
import cookies from 'cookies-js'
import Settings from 'root/common/settings.js'

export function get(...args) {
  return axios.get.apply(axios, args)
}

export function post(...args) {
  return axios.post.apply(axios, args)
}

export function throws(e) {
  throw e
}

export function makeGet(url, opts = {}) {
  return function (params) {
    var ts = ''
    if (opts.ts) {
      ts = `?_=${new Date().getTime()}`
    }
    return get(`${url}${ts}`, {
      params
    }).then((e) => {
      if (e.data.success && e.data.code == 200) {
        return e.data.data
      } else throws(e)
    })
  }
}

export function makePost(url, opts = {}) {
  return function (params) {
    var ts = ''
    if (opts.ts) {
      ts = `?_=${new Date().getTime()}`
    }
    return post(`${url}${ts}`, params).then((e) => {
      if (e.data.success && e.data.code == 200) {
        return e.data.data
      } else throws(e)
    })
  }
}


export function saveTokenAndCleanUp (token) {
  const OneWeek = 604800
  if (token !== cookies.get(Settings.TOKEN)) {
    cleanup()
  }
  cookies.set(Settings.TOKEN, token, {
    expires: OneWeek
  })
}

// logout或切换账户时需要清理的cookie都放在这里
function cleanup () {
  cookies.expire(Settings.TOKEN)
}

//modify the prefix to meet your needs
export function apiurl(url) {
  return `/api${url}`
}
