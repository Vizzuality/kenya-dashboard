import { BASIC_QUERY_HEADER } from 'constants/query';
import { REGIONS_OPTIONS } from 'constants/filters';
import { MONTHS_INITIALS, MONTHS_NAMES } from 'constants/general';

function toBase64(file, cb) {
  const reader = new FileReader();
  reader.onload = (event) => {
    cb && cb(event.target.result);
  };
  reader.readAsDataURL(file);
}

function encode(obj) {
  if (typeof btoa === 'undefined') {
    return Buffer.from(JSON.stringify(obj)).toString('base64');
  }
  return btoa(JSON.stringify(obj));
}

function decode(obj) {
  if (typeof atob === 'undefined') {
    return JSON.parse(Buffer.from(obj, 'base64').toString());
  }
  return JSON.parse(atob(decodeURIComponent(obj)));
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
    if (obj[key] && obj[key].length && key !== 'regions') {
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
      id: l.attributes && l.attributes['carto-id'] || l.id,
      boundingBox: JSON.parse(l.attributes['bounding-box'])
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

  if (itemList) {
    for (let i = 0; i < itemList.length && !item; i++) {
      if (itemList[i].list && itemList[i].list.length && `${itemList[i].id}` !== `${id}`) {
        item = getValueMatchFromCascadeList(itemList[i].list, id);
      } else if (`${itemList[i].id}` === `${id}`) {
        item = itemList[i];
      }
    }
  }
  return item;
}

function getParsedValueMatchFromCascadeList(itemList, id, rawName) {
  let item = null;
  let name = rawName ? `${rawName}` : '';

  if (itemList && Array.isArray(itemList)) {
    for (let i = 0; i < itemList.length && !item; i++) {
      if (itemList[i].list && itemList[i].list.length && `${itemList[i].id}` !== `${id}`) {
        name = `(${itemList[i].name})`;
        item = getParsedValueMatchFromCascadeList(itemList[i].list, `${id}`, name);
      } else if (`${itemList[i].id}` === `${id}`) {
        name = `${itemList[i].name} ${name}`;
        item = Object.assign({}, itemList[i]);
        item.name = name;
      }
    }
  }

  return item;
}

function roundNumberWithDecimals(number, decimals = 2) {
  if (number % 1 === 0) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  if (!Number.isNaN(number)) {
    const rounded = Number(number).toFixed(decimals).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return rounded % 1 === 0 ? (+rounded).toFixed(0) : rounded;
  }
  return 'NaN';
}

function setFormat(value, props) {
  const date = Array.isArray(value) ?
    new Date(value[0].replace(' ', 'T').replace('+', '.')) :
    new Date(value.replace(' ', 'T').replace('+', '.'));

  if (date !== 'Invalid Date') {
    if (props) {
      switch (props.format) {
        case 'yyyy': case 'YYYY': case 'yy': case 'YY': return date.getFullYear();
        case 'mm': case 'MM': return date.getUTCMonth() + 1;
        case 'm': case 'M': return MONTHS_INITIALS[date.getUTCMonth()];
        case 'month': case 'Month': return `${MONTHS_NAMES[date.getUTCMonth()]} ${date.getFullYear()}`;
        case 'dd': case 'DD': return date.getDate();
        default: return `${date.getFullYear()}/${date.getUTCMonth() + 1}/${date.getDate()}`;
      }
    }
    return `${date.getFullYear()}/${date.getUTCMonth() + 1}/${date.getDate()}`;
  }
  return value;
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
  getValueMatchFromCascadeList,
  getParsedValueMatchFromCascadeList,
  roundNumberWithDecimals,
  setFormat
};
