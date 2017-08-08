// import { Deserializer } from 'jsonapi-serializer';
import fetch from 'isomorphic-fetch';
import Router from 'next/router';

// Utils
import {
  encode,
  setBasicQueryHeaderHeaders,
  parseCustomSelectOptions,
  parseCustomSelectCascadeOptions
} from 'utils/general';

// Constants
import { BASIC_QUERY_HEADER } from 'constants/query';
import { SORT_OPTIONS } from 'constants/filters';

/* Constants */
const GET_FILTERS_OPTIONS = 'GET_FILTERS_OPTIONS';
const GET_TOPICS_OPTIONS = 'GET_TOPICS_OPTIONS';
const GET_REGIONS_OPTIONS = 'GET_REGIONS_OPTIONS';
const GET_FILTERS_LOADING = 'GET_FILTERS_LOADING';
const GET_FILTERS_ERROR = 'GET_FILTERS_ERROR';
const SET_SELECTED_FILTERS = 'SET_SELECTED_FILTERS';
const SET_DASHBOARD_LAYOUT = 'SET_DASHBOARD_LAYOUT';

/* Initial state */
const initialState = {
  options: {
    regions: [],
    topics: [],
    sort: SORT_OPTIONS
  },
  selected: {
    regions: [],
    topics: [],
    sort: []
  },
  loading: false,
  error: null,
  layout: 'grid'
};

// const DESERIALIZER = new Deserializer();

/* Reducer */
export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_FILTERS_OPTIONS:
      return Object.assign({}, state, { options: action.payload, loading: false, error: null });
    case GET_TOPICS_OPTIONS:
      return Object.assign({}, state,
        { options: { ...state.options, ...{ topics: action.payload } } });
    case GET_REGIONS_OPTIONS:
      return Object.assign({}, state,
        { options: { ...state.options, ...{ regions: action.payload } } });
    case GET_FILTERS_LOADING:
      return Object.assign({}, state, { loading: true, error: null });
    case GET_FILTERS_ERROR:
      return Object.assign({}, state, { options: {}, loading: false, error: action.payload });
    case SET_SELECTED_FILTERS:
      return Object.assign({}, state, { selected: action.payload });
    case SET_DASHBOARD_LAYOUT:
      return Object.assign({}, state, { layout: action.payload });
    default:
      return state;
  }
}

/* Action creators */
export function getFiltersOptions() {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_FILTERS_LOADING });

    fetch(`${process.env.KENYA_API}/filter?page[size]=999`, BASIC_QUERY_HEADER)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: GET_FILTERS_OPTIONS,
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

/* Get topics options */
export function getTopicsOptions() {
  return (dispatch) => {
    const headers = setBasicQueryHeaderHeaders({ Authorization: localStorage.getItem('token') });
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_FILTERS_LOADING });

    fetch(`${process.env.KENYA_API}/topics?page[size]=999`, headers)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: GET_TOPICS_OPTIONS,
          payload: parseCustomSelectOptions(data.data)
        });
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

/* Get locations options */
export function getRegionsOptions() {
  return (dispatch) => {
    const headers = setBasicQueryHeaderHeaders({ Authorization: localStorage.getItem('token') });
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_FILTERS_LOADING });

    fetch(`${process.env.KENYA_API}/regions?page[size]=999`, headers)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: GET_REGIONS_OPTIONS,
          payload: parseCustomSelectCascadeOptions(data.data)
        });
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

export function setFiltersUrl() {
  return (dispatch, getState) => {
    const { filters } = getState();
    const filtersUrl = encode(filters.selected);

    const location = {
      pathname: '/dashboard',
      query: {}
    };

    // Do not show filters param when no one selected
    if (filtersUrl !== '') {
      location.query = { filters: filtersUrl };
    }

    Router.replace(location);
  };
}

export function setDashboardLayout(layout) {
  return (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_LAYOUT,
      payload: layout
    });
  };
}
