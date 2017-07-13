import Router from 'next/router';
import { encode, decode } from 'utils/general';

// Constants
import { MAP_OPTIONS } from 'constants/map';

/* Constants */
const SET_MAP_PARAMS = 'SET_MAP_PARAMS';

/* Initial state */
const initialState = {
  areas: {
    area1: {
      center: {
        lat: MAP_OPTIONS.center[0],
        lng: MAP_OPTIONS.center[1]
      },
      zoom: MAP_OPTIONS.zoom
    }
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

    // Set pathname including indicators with / not as param
    Router.replace(location);
  };
}
