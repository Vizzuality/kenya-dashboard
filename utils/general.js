import { BASIC_QUERY_HEADER } from 'constants/query';

function toBase64(file, cb) {
  const reader = new FileReader();
  reader.onload = (event) => {
    cb && cb(event.target.result);
  };
  reader.readAsDataURL(file);
}

function encode(obj) {
  return btoa(JSON.stringify(obj));
}

function decode(obj) {
  return JSON.parse(atob(obj));
}

function parseSelectOptions(options) {
  return options.map(o => (
    { label: o.name, value: o.id || o.iso }
  ));
}

function parseObjectSelectOptions(object) {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    newObject[key] = parseSelectOptions(object[key]);
  });
  return newObject;
}

function parseObjectToUrlParams(obj) {
  let query = '';
  Object.keys(obj).forEach((key) => {
    if (obj[key].length) {
      query += query === '' ? `${key}=${obj[key]}` : `&${key}=${obj[key]}`;
    }
  });

  return query;
}

function parseCustomSelectOptions (list) {
  return list.map(l => (
    { name: l.attributes.name, id: l.id }
  ));
}

function setBasicQueryHeaderHeaders(headers) {
  const newHeaders = { ...BASIC_QUERY_HEADER.headers, ...headers };
  return { ...BASIC_QUERY_HEADER, ...{ headers: newHeaders } };
}

export {
  toBase64,
  encode,
  decode,
  parseSelectOptions,
  parseObjectSelectOptions,
  parseObjectToUrlParams,
  setBasicQueryHeaderHeaders,
  parseCustomSelectOptions
};
