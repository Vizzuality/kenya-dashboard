import { Deserializer } from 'jsonapi-serializer';
import fetch from 'isomorphic-fetch';

import { BASIC_QUERY_HEADER } from 'constants/query';

/* Constants */
const GET_INDICATORS = 'GET_INDICATORS';
const GET_INDICATORS_LOADING = 'GET_INDICATORS_LOADING';
const GET_INDICATORS_ERROR = 'GET_INDICATORS_ERROR';

const GET_SPECIFIC_INDICATORS = 'GET_SPECIFIC_INDICATORS';
const GET_SPECIFIC_INDICATORS_LOADING = 'GET_SPECIFIC_INDICATORS_LOADING';
const GET_SPECIFIC_INDICATORS_ERROR = 'GET_SPECIFIC_INDICATORS_ERROR';

/* Initial state */
const initialState = {
  list: [],
  loading: false,
  error: null,
  // Specific indicators
  specific: {
    list: [],
    loading: false,
    error: null
  }
};

const DESERIALIZER = new Deserializer();

/* Reducer */
export default function indicatorsReducer(state = initialState, action) {
  switch (action.type) {
    // All indicators
    case GET_INDICATORS:
      return Object.assign({}, state, { list: action.payload, loading: false, error: null });
    case GET_INDICATORS_LOADING:
      return Object.assign({}, state, { loading: true, error: null });
    case GET_INDICATORS_ERROR:
      return Object.assign({}, state, { list: [], loading: false, error: action.payload });
    // Specific indicators
    case GET_SPECIFIC_INDICATORS: {
      const newSpecific = Object.assign({}, state.specific,
        { list: action.payload, loading: false, error: null });
      return Object.assign({}, state, { specific: newSpecific });
    }
    case GET_SPECIFIC_INDICATORS_LOADING: {
      const newSpecific = Object.assign({}, state.specific,
        { loading: true, error: null });
      return Object.assign({}, state, { specific: newSpecific });
    }
    case GET_SPECIFIC_INDICATORS_ERROR: {
      const newSpecific = Object.assign({}, state.specific,
        { list: [], loading: false, error: action.payload });
      return Object.assign({}, state, { specific: newSpecific });
    }
    default:
      return state;
  }
}

/* Action creators */
export function getIndicators(filters) {
  const query = filters ? Object.keys(filters).map(key => `${key}=${filters[key]}`).join(',') : '';

  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_INDICATORS_LOADING });

    fetch(`${process.env.KENYA_API}/indicator?${query}&page[size]=999999999`, BASIC_QUERY_HEADER)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: GET_INDICATORS,
          payload: data
        });
        // DESERIALIZER.deserialize(data, (err, dataParsed) => {
        //   dispatch({
        //     type: GET_INDICATORS,
        //     payload: dataParsed
        //   });
        // });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_INDICATORS_ERROR,
          payload: err.message
        });
      });
  };
}

export function getSpecificIndicators(indicators) {
  const ids = indicators.split(',');
  const query = ids.map(id => `id=${id}`).join('&');
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_SPECIFIC_INDICATORS_LOADING });

    fetch(`${process.env.KENYA_API}/indicator?${query}&page[size]=999999999`, BASIC_QUERY_HEADER)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: GET_SPECIFIC_INDICATORS,
          payload: data
        });
        // DESERIALIZER.deserialize(data, (err, dataParsed) => {
        //   dispatch({
        //     type: GET_INDICATORS,
        //     payload: dataParsed
        //   });
        // });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_SPECIFIC_INDICATORS_ERROR,
          payload: err.message
        });
      });
  };
}
