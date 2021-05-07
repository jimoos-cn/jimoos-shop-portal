const Methods = {
  PATCH: 'patch',
  GET: 'get',
  PUT: 'put',
  POST: 'post',
  DELETE: 'delete'
}

const ContentTypes = {
  FORM: 0, // application/x-www-form-urlencoded
  JSON: 1,
  FORM_DATA: 2
}
export default Methods
export {
  ContentTypes,
  Methods
}
