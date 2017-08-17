/* Constants */
const SET_REGION = 'SET_REGION';

/* Initial state */
const initialState = {
  region: 'kenya'
};

/* Reducer */
export default function compareReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REGION:
      return { region: action.payload };
    default:
      return state;
  }
}

/* Action creators */
export function setRegion(region) {
  return {
    type: SET_REGION,
    payload: region
  };
}
