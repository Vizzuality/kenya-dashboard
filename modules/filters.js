// import { Deserializer } from 'jsonapi-serializer';
import fetch from 'isomorphic-fetch';
import { encode } from 'utils/general';
import Router from 'next/router';

// Constants
import { BASIC_QUERY_HEADER } from 'constants/query';

/* Constants */
const GET_FILTERS_OPTIONS = 'GET_FILTERS_OPTIONS';
const GET_FILTERS_LOADING = 'GET_FILTERS_LOADING';
const GET_FILTERS_ERROR = 'GET_FILTERS_ERROR';
const SET_SELECTED_FILTERS = 'SET_SELECTED_FILTERS';
const REMOVE_SELECTED_FILTER = 'REMOVE_SELECTED_FILTER';
const SET_DASHBOARD_LAYOUT = 'SET_DASHBOARD_LAYOUT';

/* Initial state */
const initialState = {
  options: {},
  selected: {
    areas: [],
    categories: [],
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
