export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function validatePhone(phone){
  return /^[0-9]*$/.test(phone)
}

export function validateOnlyNumber(str) {
  return /^[0-9]*$/.test(str)
}

export function validatePassword (str) {
  if (!str) return false
  return /^[\x21-\x7e]{6,20}$/.test(str)
}
