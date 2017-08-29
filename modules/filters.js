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
import { SORT_OPTIONS } from 'constants/filters';

/* Constants */
const GET_FILTERS_OPTIONS = 'GET_FILTERS_OPTIONS';
const GET_TOPICS_OPTIONS = 'GET_TOPICS_OPTIONS';
const GET_REGIONS_OPTIONS = 'GET_REGIONS_OPTIONS';
const GET_FILTERS_LOADING = 'GET_FILTERS_LOADING';
const GET_FILTERS_ERROR = 'GET_FILTERS_ERROR';
const SET_SELECTED_FILTERS = 'SET_SELECTED_FILTERS';
const REMOVE_SELECTED_FILTER = 'REMOVE_SELECTED_FILTER';
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
    case REMOVE_SELECTED_FILTER:
      return Object.assign({}, state, { selected: action.payload });
    case SET_DASHBOARD_LAYOUT:
      return Object.assign({}, state, { layout: action.payload });
    default:
      return state;
  }
}

/* Action creators */
/* Get topics options */
export function getTopicsOptions() {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_FILTERS_LOADING });

    return fetch(`${process.env.KENYA_API}/topics?page[size]=999`)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        const addedData = [{ id: 'all', attributes: { name: 'All' } }].concat(data.data);

        dispatch({
          type: GET_TOPICS_OPTIONS,
          payload: parseCustomSelectOptions(addedData)
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
  return (dispatch, getState) => {
    const token = getState().user.auth_token;
    const headers = setBasicQueryHeaderHeaders({ Authorization: token });
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

export function removeSelectedFilter(type, value) {
  return (dispatch, getState) => {
    const selected = { ...getState().filters.selected };
    const index = selected[type].indexOf(value);
    const newTypefilters = selected[type].slice();
    newTypefilters.splice(index, 1);
    selected[type] = newTypefilters;

    dispatch({
      type: REMOVE_SELECTED_FILTER,
      payload: selected
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
