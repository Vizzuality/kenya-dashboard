import { BASIC_QUERY_HEADER } from 'constants/query';
import { REGIONS_OPTIONS } from 'constants/filters';

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
  const FILTERS_KEYS = {
    topics: 'filter[topic_id]',
    regions: 'filter[region_id]',
    sort: 'sort'
  };

  let query = '';
  Object.keys(obj).forEach((key) => {
    if (obj[key].length) {
      query += query === '' ? `&${FILTERS_KEYS[key]}=${obj[key]}` : `&${FILTERS_KEYS[key]}=${obj[key]}`;
    }
  });

  return query;
}

function parseCustomSelectOptions(list) {
  return list.map(l => (
    { name: l.attributes.name, id: l.id }
  ));
}

function parseCustomSelectCascadeOptions(list) {
  const partialParse = {};
  REGIONS_OPTIONS.forEach(r => partialParse[r.id] = r);

  list.forEach((l) => {
    partialParse[l.attributes['region-type']].list.push({
      name: l.attributes.name,
      id: l.id
    });
  });

  return Object.keys(partialParse).map(key => partialParse[key]);
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
  parseCustomSelectOptions,
  parseCustomSelectCascadeOptions
};
