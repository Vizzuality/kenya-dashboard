import fetch from 'isomorphic-fetch';
import { Deserializer } from 'jsonapi-serializer';

// Utils
import {
  setBasicQueryHeaderHeaders
} from 'utils/general';


// CONSTANTS
const GET_AGENCIES = 'GET_AGENCIES';
const GET_AGENCIES_LOADING = 'GET_AGENCIES_LOADING';
const GET_AGENCIES_ERROR = 'GET_AGENCIES_ERROR';
const GET_AGENCY = 'GET_AGENCY';
const GET_AGENCY_LOADING = 'GET_AGENCY_LOADING';
const GET_AGENCY_ERROR = 'GET_AGENCY_ERROR';

// REDUCER
const initialState = {
  list: [],
  loading: false,
  error: null,
  agency: {}
};

const DESERIALIZER = new Deserializer();


export default function (state = initialState, action) {
  switch (action.type) {
    case GET_AGENCIES:
      return Object.assign({}, state, { list: action.payload, loading: false, error: null });
    case GET_AGENCIES_LOADING:
      return Object.assign({}, state, { loading: true });
    case GET_AGENCIES_ERROR:
      return Object.assign({}, state, { error: action.payload, loading: false });
    // Agency
    case GET_AGENCY:
      return Object.assign({}, state, { agency: action.payload, logged: false });
    case GET_AGENCY_LOADING:
      return Object.assign({}, state, { loading: true });
    case GET_AGENCY_ERROR:
      return Object.assign({}, state, { error: action.payload, loading: false });
    default:
      return state;
  }
}


// ACTIONS
export function getAgencies() {
  return (dispatch, getState) => {
    const currentState = getState();
    const headers = setBasicQueryHeaderHeaders({ Authorization: currentState.user.auth_token });
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_AGENCIES_LOADING });

    return fetch(`${process.env.KENYA_API}/agencies?page[size]=999`, headers)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        return DESERIALIZER.deserialize(data, (err, dataParsed) => {
          dispatch({
            type: GET_AGENCIES,
            payload: dataParsed
          });
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_AGENCIES_ERROR,
          payload: err.message
        });
      });
  };
}

export function getAgency(id) {
  return (dispatch, getState) => {
    const currentState = getState();
    const headers = setBasicQueryHeaderHeaders({ Authorization: currentState.user.auth_token });
    dispatch({ type: GET_AGENCY_LOADING });

    return fetch(`${process.env.KENYA_API}/agencies/${id}?include=indicators&page[size]=999`, headers)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        return DESERIALIZER.deserialize(data, (err, dataParsed) => {
          dispatch({
            type: GET_AGENCY,
            payload: dataParsed
          });
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_AGENCY_ERROR,
          payload: err.message
        });
      });
  };
}
