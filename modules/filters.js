// import { Deserializer } from 'jsonapi-serializer';
import fetch from 'isomorphic-fetch';
import { parseObjectSelectOptions } from 'utils/general';

import { BASIC_QUERY_HEADER } from 'constants/query';

/* Constants */
const GET_FILTERS_OPTIONS = 'GET_FILTERS_OPTIONS';
const GET_FILTERS_LOADING = 'GET_FILTERS_LOADING';
const GET_FILTERS_ERROR = 'GET_FILTERS_ERROR';
const SET_SELECTED_FILTERS = 'SET_SELECTED_FILTERS';

/* Initial state */
const initialState = {
  options: {},
  selected: {
    countries: [],
    counties: [],
    categories: [],
    dates: [],
    sort: []
  },
  loading: false,
  error: null
};

// const DESERIALIZER = new Deserializer();

/* Reducer */
export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_FILTERS_OPTIONS:
      return Object.assign({}, state, { options: action.payload, loading: false, error: null });
    case GET_FILTERS_LOADING:
      return Object.assign({}, state, { loading: true, error: null });
    case GET_FILTERS_ERROR:
      return Object.assign({}, state, { options: {}, loading: false, error: action.payload });
    case SET_SELECTED_FILTERS:
      return Object.assign({}, state, { selected: action.payload });
    default:
      return state;
  }
}

/* Action creators */
export function getFiltersOptions() {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_FILTERS_LOADING });

    fetch(`${process.env.KENYA_API}/filter?page[size]=999999999`, BASIC_QUERY_HEADER)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: GET_FILTERS_OPTIONS,
          payload: parseObjectSelectOptions(data)
        });
        // DESERIALIZER.deserialize(data, (err, dataParsed) => {
        //   dispatch({
        //     type: GET_FILTERS,
        //     payload: dataParsed
        //   });
        // });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_FILTERS_ERROR,
          payload: err.message
        });
      });
  };
}

export function setSelectedFilters(filters) {
  return (dispatch) => {
    dispatch({
      type: SET_SELECTED_FILTERS,
      payload: filters
    });
  };
}
