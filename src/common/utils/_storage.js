/** namespace management of cookie, localstorage and sessionstorage */

import cookies from 'cookies-js'
import Settings from 'root/common/settings.js'
import { rot13encode, rot13decode } from 'utils/_rot13.js'

cookies.set(Settings.PROJECT, JSON.stringify({}))
localStorage.setItem(Settings.PROJECT, JSON.stringify({}))
sessionStorage.setItem(Settings.PROJECT, JSON.stringify({}))

function setCookie (key, value) {
  const v = JSON.parse(rot13decode(cookies.get(Settings.PROJECT)))
  v[key] = value
  cookies.set(Settings.PROJECT, rot13encode(JSON.stringify(v)))
}

function getCookie (key) {
  return JSON.parse(rot13decode(cookies.get(Settings.PROJECT)))[key]
}

function setLocalStorage (key, value) {
  const v = JSON.parse(rot13decode(localStorage.getItem(Settings.PROJECT)))
  v[key] = value
  localStorage.setItem(Settings.PROJECT, rot13encode(JSON.stringify(v)))
}

function getLocalStorage (key) {
  return JSON.parse(rot13decode(localStorage.getItem(Settings.PROJECT)))[key]
}

function setSessionStorage (key, value) {
  const v = JSON.parse(rot13decode(sessionStorage.getItem(Settings.PROJECT)))
  v[key] = value
  sessionStorage.setItem(Settings.PROJECT, rot13encode(JSON.stringify(v)))
}

function getSessionStorage (key) {
  return JSON.parse(rot13decode(sessionStorage.getItem(Settings.PROJECT)))[key]
}

export const cookie = {
  set: setCookie,
  get: getCookie
}

export const local = {
  set: setLocalStorage,
  get: getLocalStorage
}

export const session = {
  set: setSessionStorage,
  get: getSessionStorage
}