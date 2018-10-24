import { apiurl, throws, makeGet, makePost, debugApi, saveTokenAndCleanUp} from './_helper.js'

const api = {}

api.isRegistered = makeGet(apiurl('/register/is-registered'))

api.register = function register (params) {
  const _login = makePost(apiurl('/register/register'))
  return _login(params).then(saveTokenAndCleanUp)
}

api.sendCodeByEmail = makeGet(apiurl('/register/send-code-by-email'))
api.sendCodeByPhone = makeGet(apiurl('/register/send-code-by-phone'))

export default api