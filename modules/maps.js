import Router from 'next/router';
import { encode, decode } from 'utils/general';

// Constants
import { MAP_OPTIONS } from 'constants/map';

/* Constants */
const SET_MAP_PARAMS = 'SET_MAP_PARAMS';
const SET_MAP_EXPANSION = 'SET_MAP_EXPANSION';
const ADD_AREA = 'ADD_AREA';
const SELECT_REGION = 'SELECT_REGION';
const REMOVE_AREA = 'REMOVE_AREA';

const DEFAULT_AREA_PARAMS = {
  center: {
    lat: MAP_OPTIONS.center[0],
    lng: MAP_OPTIONS.center[1]
  },
  zoom: MAP_OPTIONS.zoom,
  region: '281'
};

/* Initial state */
const initialState = {
  areas: {
    defaultAreaMap: DEFAULT_AREA_PARAMS
  },
  expanded: false
};

/* Reducer */
export default function mapsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_MAP_PARAMS: {
      const newAreaParams = Object.assign({}, state.areas, action.payload);
      return Object.assign({}, state, { areas: newAreaParams });
    }
    case SET_MAP_EXPANSION:
      return Object.assign({}, state, { expanded: action.payload });
    case ADD_AREA: {
      const newAreaParams = Object.assign({}, state.areas, {
        [Math.random()]: DEFAULT_AREA_PARAMS
      });
      return Object.assign({}, state, { areas: newAreaParams });
    }
    case SELECT_REGION: {
      return Object.assign({}, state, { areas: action.payload });
    }
    case REMOVE_AREA:
      return Object.assign({}, state, { areas: action.payload });
    default:
      return state;
  }
}

/* Action creators */
export function setSingleMapParams(params, key) {
  return (dispatch) => {
    dispatch({
      type: SET_MAP_PARAMS,
      payload: { [key]: params }
    });
  };
}

export function setSingleMapParamsUrl(params, url) {
  return () => {
    const urlParams = url.query.maps ? decode(url.query.maps) : {};
    const newAreasParams = Object.assign({}, urlParams,
      { [params.key]: {
        lat: params.center.lat,
        lng: params.center.lng,
        zoom: params.zoom,
        region: params.region || '281'
      } });
    const location = {
      pathname: url.pathname,
      query: Object.assign({}, url.query, { maps: encode(newAreasParams) })
    };

    Router.replace(location);
  };
}

export function setMapExpansion(expand) {
  return (dispatch) => {
    dispatch({
      type: SET_MAP_EXPANSION,
      payload: !!expand
    });
  };
}

export function setMapExpansionUrl(expanded, url) {
  return () => {
    const newQuery = {};

    Object.keys(url.query).forEach((key) => {
      if (key !== 'expanded') {
        newQuery[key] = url.query[key];
      }
    });
    if (expanded) newQuery.expanded = true;

    const location = { pathname: url.pathname, query: newQuery };

    Router.replace(location);
  };
}

// Fit area bounds
export function fitAreaBounds() {
  return () => {
  };
}

// Areas
export function addArea() {
  return (dispatch) => {
    dispatch({
      type: ADD_AREA
    });
  };
}

export function selectRegion(region, area) {
  return (dispatch, getState) => {
    const newArea = Object.assign({}, getState().maps.areas[area], { region });
    const newAreas = Object.assign({}, getState().maps.areas, { [area]: newArea });

    dispatch({
      type: SELECT_REGION,
      payload: newAreas
    });
  };
}

export function removeArea(id) {
  return (dispatch, getState) => {
    const areas = getState().maps.areas;
    const activeIds = Object.keys(areas).filter(key => key !== id);
    const newAreas = {};
    activeIds.forEach((aId) => {
      newAreas[aId] = areas[aId];
    });

    dispatch({
      type: REMOVE_AREA,
      payload: newAreas
    });
  };
}

export function setAreasParamsUrl(url) {
  return (dispatch, getState) => {
    const areas = getState().maps.areas;
    const newAreas = {};

    Object.keys(areas).forEach((key) => {
      newAreas[key] = {
        zoom: areas[key].zoom,
        region: areas[key].region,
        lat: areas[key].center.lat,
        lng: areas[key].center.lng
      };
    });

    const location = {
      pathname: url.pathname,
      query: Object.assign({}, url.query, { maps: encode(newAreas) })
    };

    Router.replace(location);
  };
}
