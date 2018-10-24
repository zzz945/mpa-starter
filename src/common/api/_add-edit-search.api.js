import { apiurl, throws, makeGet, makePost, debugApi} from './_helper.js'

const api = {}

api.search = function search (curPage, pageSize, params) {
  const _search = makeGet(apiurl('/add-edit-search/search'))
  return _search({
    ...params,
    curPage,
    pageSize,
  })
}

api.getItem = function getItem (id) {
  return api.search(1, 10, {id}).then(res => res.items.length ? res.items[0] : {})
}

api.delete = function deleteItem (id) {
  const _delete = makeGet(apiurl('/add-edit-search/delete'))
  return _delete({
    id
  })
}

api.add = makeGet(apiurl('/add-edit-search/add'))
api.update = makeGet(apiurl('/add-edit-search/update'))

export default api