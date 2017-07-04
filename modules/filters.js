import { Deserializer } from 'jsonapi-serializer';
import fetch from 'isomorphic-fetch';

import { BASIC_QUERY_HEADER } from 'constants/query';

/* Constants */
const GET_FILTERS = 'GET_FILTERS';
const GET_FILTERS_LOADING = 'GET_FILTERS_LOADING';
const GET_FILTERS_ERROR = 'GET_FILTERS_ERROR';

/* Initial state */
const initialState = {
  list: [],
  loading: false,
  error: null
};

const DESERIALIZER = new Deserializer();

/* Reducer */
export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_FILTERS:
      return Object.assign({}, state, { list: action.payload, loading: false, error: null });
    case GET_FILTERS_LOADING:
      return Object.assign({}, state, { loading: true, error: null });
    case GET_FILTERS_ERROR:
      return Object.assign({}, state, { list: [], loading: false, error: action.payload });
    default:
      return state;
  }
}

/* Action creators */
export function getFilters() {
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
          type: GET_FILTERS,
          payload: data
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
