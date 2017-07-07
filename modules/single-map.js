import Router from 'next/router';

// Constants
import { MAP_OPTIONS } from 'constants/map';

/* Constants */
const SET_SINGLE_MAP_PARAMS = 'SET_SINGLE_MAP_PARAMS';

/* Initial state */
const initialState = {
  center: {
    lat: MAP_OPTIONS.center[0],
    lng: MAP_OPTIONS.center[1]
  },
  zoom: MAP_OPTIONS.zoom
};

/* Reducer */
export default function singleMapReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SINGLE_MAP_PARAMS: {
      return Object.assign({}, state, action.payload);
    }
    default:
      return state;
  }
}

/* Action creators */
export function setSingleMapParams(params) {
  return (dispatch) => {
    dispatch({
      type: SET_SINGLE_MAP_PARAMS,
      payload: params
    });
  };
}

export function setSingleMapParamsUrl(url) {
  return (dispatch, getState) => {
    const { singleMap } = getState();
    const indicatorsPathname = `${url.pathname}/${url.query.indicators}`;
    const lat = singleMap.center.lat.toFixed(2);
    const lng = singleMap.center.lng.toFixed(2);
    const zoom = singleMap.zoom;
    const params = `zoom=${zoom}&lat=${lat}&lng=${lng}`;

    // Set location with indicators
    const location = {
      pathname: url.pathname,
      query: { lat, lng, zoom, indicators: url.query.indicators }
    };

    // Set pathname including indicators with / not as param
    Router.replace(location, `${indicatorsPathname}?${params}`);
  };
}
