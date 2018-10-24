import _ from 'lodash'

export default function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decodeURIComponent(parts.shift());
    var val = parts.length > 0
      ? decodeURIComponent(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

/**
 * 将对象字面量 转换为&连接的查询字符串
 * @param {*} obj
 */
export function encodeQuery(obj) {
  if (_.isEmpty(obj)) return ''
  let res = ''
  for (let key in obj) {
    let k = encodeURIComponent(key.trim()), val
    let _val = obj[key]
    if (obj[key] === undefined || _val === null) {
      val = ''
    } else {
      val = encodeURIComponent(_val.toString().trim())
    }
    res += `${k}=${val}&`
  }
  //去除最后的&
  res = res.slice(0, -1)
  return res
}
