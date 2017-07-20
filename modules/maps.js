import Router from 'next/router';
import { encode, decode } from 'utils/general';

// Constants
import { MAP_OPTIONS } from 'constants/map';

/* Constants */
const SET_MAP_PARAMS = 'SET_MAP_PARAMS';
const SET_MAP_EXPANSION = 'SET_MAP_EXPANSION';
const ADD_AREA = 'ADD_AREA';
const REMOVE_AREA = 'REMOVE_AREA';

const DEFAULT_AREA_PARAMS = {
  center: {
    lat: MAP_OPTIONS.center[0],
    lng: MAP_OPTIONS.center[1]
  },
  zoom: MAP_OPTIONS.zoom,
  type: '',
  name: ''
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
    const lat = params.center.lat.toFixed(2);
    const lng = params.center.lng.toFixed(2);
    const zoom = params.zoom;
    const newAreasParams = Object.assign({}, urlParams, { [params.key]: { lat, lng, zoom } });

    // Set location with indicators
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
      payload: expand
    });
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
