// import { Deserializer } from 'jsonapi-serializer';
import fetch from 'isomorphic-fetch';
import Router from 'next/router';
import { parseObjectToUrlParams } from 'utils/general';

import { BASIC_QUERY_HEADER } from 'constants/query';

/* Constants */
// All indicators
const GET_INDICATORS = 'GET_INDICATORS';
const GET_INDICATORS_LOADING = 'GET_INDICATORS_LOADING';
const GET_INDICATORS_ERROR = 'GET_INDICATORS_ERROR';
// Specific indicators
const GET_SPECIFIC_INDICATORS = 'GET_SPECIFIC_INDICATORS';
const GET_SPECIFIC_INDICATORS_LOADING = 'GET_SPECIFIC_INDICATORS_LOADING';
const GET_SPECIFIC_INDICATORS_ERROR = 'GET_SPECIFIC_INDICATORS_ERROR';
const ADD_INDICATOR = 'ADD_INDICATOR';
const REMOVE_INDICATOR = 'REMOVE_INDICATOR';
// All indicators filter list
const GET_INDICATORS_FILTER_LIST = 'GET_INDICATORS_FILTER_LIST';
const GET_INDICATORS_FILTER_LIST_LOADING = 'GET_INDICATORS_FILTER_LIST_LOADING';
const GET_INDICATORS_FILTER_LIST_ERROR = 'GET_INDICATORS_FILTER_LIST_ERROR';
// Layers
const SET_SPECIFIC_LAYERS_ACTIVE = 'SET_SPECIFIC_LAYERS_ACTIVE';
const SET_INDICATORS_LAYERS = 'SET_INDICATORS_LAYERS';


/* Initial state */
const initialState = {
  list: [],
  loading: false,
  error: null,
  // Specific indicators
  specific: {
    list: [],
    loading: false,
    error: null,
    layers: [],
    layersActive: [],
    indicatorsWithLayers: []
  },
  filterList: {
    list: {},
    loading: false,
    error: null
  }
};

// const DESERIALIZER = new Deserializer();

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
      const indicatorsWithLayers = action.payload.filter(ind => ind.layers && ind.layers.length);
      const layers = indicatorsWithLayers.map(ind => ind.layers[0]);
      const newSpecific = Object.assign({}, state.specific,
        {
          list: action.payload,
          loading: false,
          error: null,
          indicatorsWithLayers,
          layers,
          layersActive: layers.map(ind => ind.id)
        });
      return Object.assign({}, state, { specific: newSpecific });
    }
    case GET_SPECIFIC_INDICATORS_LOADING: {
      const newSpecific = Object.assign({}, state.specific,
        { loading: true, error: null });
      return Object.assign({}, state, { specific: newSpecific });
    }
    case GET_SPECIFIC_INDICATORS_ERROR: {
      const newSpecific = Object.assign({}, state.specific,
        { list: [], loading: false, error: action.payload, indicatorsWithLayers: [] });
      return Object.assign({}, state, { specific: newSpecific });
    }
    // Add & remove indicators
    case ADD_INDICATOR:
      return Object.assign({}, state, { specific: action.payload });
    case REMOVE_INDICATOR:
      return Object.assign({}, state, { specific: action.payload });
    // All indicators filter list
    case GET_INDICATORS_FILTER_LIST: {
      const newFilterList = Object.assign({}, state.filterList,
        { list: action.payload, loading: false, error: null });
      return Object.assign({}, state, { filterList: newFilterList });
    }
    case GET_INDICATORS_FILTER_LIST_LOADING: {
      const newFilterList = Object.assign({}, state.filterList,
        { loading: true, error: null });
      return Object.assign({}, state, { filterList: newFilterList });
    }
    case GET_INDICATORS_FILTER_LIST_ERROR: {
      const newFilterList = Object.assign({}, state.filterList,
        { list: [], loading: false, error: action.payload, indicatorsWithLayers: [] });
      return Object.assign({}, state, { filterList: newFilterList });
    }
    // Layers
    case SET_SPECIFIC_LAYERS_ACTIVE: {
      const newSpecific = Object.assign({}, state.specific,
        { layersActive: action.payload });
      return Object.assign({}, state, { specific: newSpecific });
    }
    case SET_INDICATORS_LAYERS: {
      const newSpecific = Object.assign({}, state.specific,
        { layers: action.payload });
      return Object.assign({}, state, { specific: newSpecific });
    }
    default:
      return state;
  }
}

/* Action creators */
export function getIndicators(filters) {
  const query = parseObjectToUrlParams(filters);

  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_INDICATORS_LOADING });

    fetch(`${process.env.KENYA_API}/indicators?${query}&page[size]=999999999`, BASIC_QUERY_HEADER)
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


/* Specific Indicators */
export function setIndicatorsLayersActive(layersActive) {
  return (dispatch) => {
    dispatch({
      type: SET_SPECIFIC_LAYERS_ACTIVE,
      payload: layersActive
    });
  };
}

export function getSpecificIndicators(ids) {
  const query = ids.split(',').map(id => `id=${id}`).join('&');
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_SPECIFIC_INDICATORS_LOADING });

    fetch(`${process.env.KENYA_API}/indicators?${query}&page[size]=999999999`, BASIC_QUERY_HEADER)
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

export function setIndicatorsLayers(layers) {
  return (dispatch) => {
    dispatch({
      type: SET_INDICATORS_LAYERS,
      payload: layers
    });
  };
}

export function addIndicator(id) {
  return (dispatch, getState) => {
    dispatch({ type: GET_SPECIFIC_INDICATORS_LOADING });

    fetch(`${process.env.KENYA_API}/indicators?id=${id}&page[size]=999999999`, BASIC_QUERY_HEADER)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        const specific = getState().indicators.specific;
        // Update state attributes with new data
        const list = data[0] ? [data[0]].concat(specific.list) : specific.list;
        const indicatorsWithLayers = data[0].layers && data[0].layers.length ?
          [data[0]].concat(specific.indicatorsWithLayers) :
          specific.indicatorsWithLayers;

        const layers = data[0].layers && data[0].layers.length ?
          [data[0].layers[0]].concat(specific.layers) :
          specific.layers;

        const layersActive = data[0].layers && data[0].layers.length ?
          [data[0].layers[0].id].concat(specific.layersActive) :
          specific.layersActive;

        const newSpecific = Object.assign({}, specific,
          { list, indicatorsWithLayers, layers, layersActive });

        dispatch({
          type: ADD_INDICATOR,
          payload: newSpecific
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

export function removeIndicator(id) {
  return (dispatch, getState) => {
    const state = getState().indicators.specific;
    // Update state with new data
    const list = state.list.filter(ind => ind.id !== id);
    const indicatorsWithLayers = state.indicatorsWithLayers.filter(ind => ind.id !== id);
    const layers = state.layers.filter(lay => lay.attributes.indicator !== id);
    const layersActive = layers.map(l => l.id);

    const newSpecific = Object.assign({}, state,
      { list, indicatorsWithLayers, layers, layersActive });

    dispatch({
      type: REMOVE_INDICATOR,
      payload: newSpecific
    });
  };
}

// Get indicators to set de filter list
export function getIndicatorsFilterList() {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_INDICATORS_FILTER_LIST_LOADING });

    fetch(`${process.env.KENYA_API}/indicators-groups?page[size]=999999999`, BASIC_QUERY_HEADER)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        dispatch({
          type: GET_INDICATORS_FILTER_LIST,
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
          type: GET_INDICATORS_FILTER_LIST_ERROR,
          payload: err.message
        });
      });
  };
}

export function setIndicatorsParamsUrl(indicatorId, type, url) {
  return () => {
    let newQuery = {};
    const { indicators } = url.query;
    const indicatorsIds = indicators ? indicators.split(',') : [];

    // Update indicators ids
    if (type === 'add') {
      indicatorsIds.push(`${indicatorId}`);
    } else { // Remove
      const idIndex = indicatorsIds.indexOf(`${indicatorId}`);
      indicatorsIds.splice(idIndex, 1);
    }

    // Show indicators param if there are ids, or hide if not
    if (indicatorsIds.length) {
      newQuery = { ...url.query, indicators: indicatorsIds.join(',') };
    } else {
      Object.keys(url.query).forEach((key) => {
        if (key !== 'indicators') newQuery = url.query[key];
      });
    }

    const location = { pathname: url.pathname, query: newQuery };
    Router.replace(location);
  };
}
