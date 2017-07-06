/* Constants */
const SET_MAP_LOCATION = 'SET_MAP_LOCATION';

/* Initial state */
const initialState = {
  latLng: {
    lat: 30,
    lng: -15
  },
  zoom: 3
};

/* Reducer */
export default function mapReducer(state = initialState, action) {
  switch (action.type) {
    case SET_MAP_LOCATION:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

/* Action creators */
export function setMapLocation(locationParams) {
  return {
    type: SET_MAP_LOCATION,
    payload: locationParams
  };
}
