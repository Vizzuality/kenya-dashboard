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
    if (obj[key].length && key !== 'regions') {
      query += query === '' ? `&${FILTERS_KEYS[key]}=${obj[key]}` : `&${FILTERS_KEYS[key]}=${obj[key]}`;
    }
  });

  return query;
}

function getThreshold(value, threshold) {
  if (value && threshold) {
    const status = {
      2: ['fail', 'success'],
      3: ['fail', 'medium', 'success'],
      4: ['fail', 'weak', 'medium', 'success'],
      5: ['fail', 'weak', 'medium', 'good', 'success']
    };
    const values = Object.values(threshold);
    const len = values.filter(v => value > v).length;

    return status[values.length + 1][len];
  }

  return 'unknown';
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

function getValueMatchFromCascadeList(itemList, id) {
  let item = null;
  for (let i = 0; i < itemList.length && !item; i++) {
    if (itemList[i].list && itemList[i].list.length && itemList[i].id !== id) {
      item = getValueMatchFromCascadeList(itemList[i].list, id);
    } else if (itemList[i].id === id) {
      item = itemList[i];
    }
  }
  return item;
}

export {
  toBase64,
  encode,
  decode,
  parseSelectOptions,
  parseObjectSelectOptions,
  parseObjectToUrlParams,
  getThreshold,
  setBasicQueryHeaderHeaders,
  parseCustomSelectOptions,
  parseCustomSelectCascadeOptions,
  getValueMatchFromCascadeList
};
