import { apiurl, throws, makeGet, makePost, debugApi, saveTokenAndCleanUp} from './_helper.js'

const api = {}

api.isRegistered = makeGet(apiurl('/login/is-registered'))

api.login = function login (params) {
  const _login = makePost(apiurl('/login/login'))
  return _login(params).then(saveTokenAndCleanUp)
}

api.sendCodeByEmail = makeGet(apiurl('/login/send-code-by-email'))
api.sendCodeByPhone = makeGet(apiurl('/login/send-code-by-phone'))
api.resetPassword = makePost(apiurl('/login/reset-password'))

export default api