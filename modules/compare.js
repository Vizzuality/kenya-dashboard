/* Constants */
const SET_REGION = 'SET_REGION';
const SET_VIEW = 'SET_VIEW';

/* Initial state */
const initialState = {
  region: 'kenya',
  view: 'map'
};

/* Reducer */
export default function compareReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REGION:
      return { region: action.payload };
    case SET_VIEW:
      return { view: action.payload };
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

export function setView() {
  return (dispatch, getState) => {
    dispatch({
      type: SET_VIEW,
      payload: getState().compare.view === 'map' ? 'list' : 'map'
    });
  };
}
