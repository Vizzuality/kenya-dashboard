import { Deserializer } from 'jsonapi-serializer';
import fetch from 'isomorphic-fetch';
import Router from 'next/router';

// Libraries
import flattenDeep from 'lodash/flattenDeep';

// Utils
import { setBasicQueryHeaderHeaders, parseObjectToUrlParams } from 'utils/general';
import { getIndicatorLayers } from 'utils/indicators';


/* Constants */
// All indicators
const GET_INDICATORS = 'GET_INDICATORS';
const GET_INDICATORS_LOADING = 'GET_INDICATORS_LOADING';
const GET_INDICATORS_ERROR = 'GET_INDICATORS_ERROR';
// Specific indicators
const GET_SPECIFIC_INDICATORS = 'GET_SPECIFIC_INDICATORS';
const GET_SPECIFIC_INDICATORS_LOADING = 'GET_SPECIFIC_INDICATORS_LOADING';
const GET_SPECIFIC_INDICATORS_ERROR = 'GET_SPECIFIC_INDICATORS_ERROR';
const RESET_SPECIFIC_INDICATORS = 'RESET_SPECIFIC_INDICATORS';
const ADD_INDICATOR = 'ADD_INDICATOR';
const REMOVE_INDICATOR = 'REMOVE_INDICATOR';
const SET_INDICATOR_DATES = 'SET_INDICATOR_DATES';
// Layers
const SET_SPECIFIC_LAYERS_ACTIVE = 'SET_SPECIFIC_LAYERS_ACTIVE';
const SET_INDICATORS_LAYERS = 'SET_INDICATORS_LAYERS';


/* Initial state */
const initialState = {
  list: [],
  loading: false,
  error: null,
  dates: {},
  // Specific indicators
  specific: {
    list: [],
    loading: false,
    error: null,
    layers: [],
    layersActive: [],
    contextualLayers: null,
    indicatorsWithLayers: []
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
      return Object.assign({}, state, { specific: action.payload });
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
    case RESET_SPECIFIC_INDICATORS: {
      return Object.assign({}, state, { specific: initialState.specific });
    }
    // Add & remove indicators
    case ADD_INDICATOR:
      return Object.assign({}, state, { specific: action.payload });
    case REMOVE_INDICATOR:
      return Object.assign({}, state, { specific: action.payload });
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
    case SET_INDICATOR_DATES: {
      return Object.assign({}, state, { dates: action.payload });
    }
    default:
      return state;
  }
}

/* Action creators */
export function getIndicators(filters) {
  const query = filters ? parseObjectToUrlParams(filters) : '';

  return (dispatch, getState) => {
    const currentState = getState();
    const headers = setBasicQueryHeaderHeaders({ Authorization: currentState.user.auth_token });

    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_INDICATORS_LOADING });

    return fetch(`${process.env.KENYA_API}/indicators?include=topic,widgets,agency&page[size]=999${query}`, headers)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        return DESERIALIZER.deserialize(data, (err, dataParsed) => {
          /* If no filters or in compare page it sets the contextual layers as
          default but hidden from the beginning */
          if (!filters) {
            const state = currentState.indicators;
            const contextualWithLayers = dataParsed.filter(ind => (
              ind.topic.name === 'Contextual' && ind.widgets && ind.widgets.length &&
              ind.widgets.find(w => w['widget-type'] === 'layer')
            ));
            const contextualLayers = flattenDeep(contextualWithLayers.map(ind => getIndicatorLayers(ind)));
            const newSpecific = Object.assign({}, state.specific, { contextualLayers });

            dispatch({
              type: GET_SPECIFIC_INDICATORS,
              payload: newSpecific
            });
          }

          dispatch({
            type: GET_INDICATORS,
            payload: dataParsed
          });
        });
      })
      .catch((err) => {
        console.error(err);
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
  return (dispatch, getState) => {
    const currentState = getState();
    const headers = setBasicQueryHeaderHeaders({ Authorization: currentState.user.auth_token });
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_SPECIFIC_INDICATORS_LOADING });

    fetch(`${process.env.KENYA_API}/indicators?filter[id]=${ids}&include=topic,widgets,agency&page[size]=999`, headers)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        DESERIALIZER.deserialize(data, (err, dataParsed) => {
          const state = currentState.indicators;
          const indicatorsWithLayers = dataParsed.filter(ind => (
            ind.widgets && ind.widgets.length && ind.widgets.find(w => w['widget-type'] === 'layer')
          ));
          const layers = flattenDeep(indicatorsWithLayers.map(ind => getIndicatorLayers(ind)));
          const newSpecific = Object.assign({}, state.specific,
            {
              list: dataParsed,
              loading: false,
              error: null,
              indicatorsWithLayers,
              layers: layers.concat(state.specific.contextualLayers),
              layersActive: layers.map(l => l.id)
            });

          dispatch({
            type: GET_SPECIFIC_INDICATORS,
            payload: newSpecific
          });
        });
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

export function resetSpecificIndicators() {
  return (dispatch) => {
    dispatch({
      type: RESET_SPECIFIC_INDICATORS
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
    const currentState = getState();
    const headers = setBasicQueryHeaderHeaders({ Authorization: currentState.user.auth_token });

    dispatch({ type: GET_SPECIFIC_INDICATORS_LOADING });

    fetch(`${process.env.KENYA_API}/indicators?filter[id]=${id}&include=topic,widgets,agency&page[size]=999`, headers)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        DESERIALIZER.deserialize(data, (err, dataParsed) => {
          const specific = currentState.indicators.specific;
          const hasLayers = dataParsed[0].widgets && dataParsed[0].widgets.length &&
            dataParsed[0].widgets.find(w => w['widget-type'] === 'layer');

          // Update state attributes with new data
          const list = dataParsed[0] ? [dataParsed[0]].concat(specific.list) : specific.list;

          const indicatorsWithLayers = hasLayers ?
            [dataParsed[0]].concat(specific.indicatorsWithLayers) :
            specific.indicatorsWithLayers;

          const indicatorLayers = flattenDeep(getIndicatorLayers(dataParsed[0]));
          const layers = indicatorLayers.concat(specific.layers);
          const layersActive = indicatorLayers.map(l => l.id).concat(specific.layersActive);

          const newSpecific = Object.assign({}, specific,
            { list, indicatorsWithLayers, layers, layersActive });

          dispatch({
            type: ADD_INDICATOR,
            payload: newSpecific
          });
        });
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
    const list = state.list.filter(ind => `${ind.id}` !== `${id}`);
    const indicatorsWithLayers = state.indicatorsWithLayers.filter(ind => ind.id !== id);
    const layers = state.layers.filter(lay => `${lay['indicator-id']}` !== `${id}`);
    const layersActive = state.layersActive.filter(l => `${l.id}` !== `${id}`);

    const newSpecific = Object.assign({}, state,
      { list, indicatorsWithLayers, layers, layersActive });

    dispatch({
      type: REMOVE_INDICATOR,
      payload: newSpecific
    });
  };
}

export function setIndicatorsParamsUrl(indicatorId, url) {
  return () => {
    let newQuery = {};
    const { indicators } = url.query;
    const indicatorsIds = indicators ? indicators.split(',') : [];

    // Update indicators ids
    if (indicatorsIds.includes(indicatorId)) { // Remove
      const idIndex = indicatorsIds.indexOf(`${indicatorId}`);
      indicatorsIds.splice(idIndex, 1);
    } else { // Add
      indicatorsIds.push(`${indicatorId}`);
    }

    // Show indicators param if there are ids, or hide if not
    if (indicatorsIds.length) {
      newQuery = Object.assign({}, url.query, { indicators: indicatorsIds.join(',') });
    } else {
      Object.keys(url.query).forEach((key) => {
        if (key !== 'indicators') newQuery = url.query[key];
      });
    }

    const location = { pathname: url.pathname, query: newQuery };
    Router.replace(location);
  };
}

export function setIndicatorDates(indicator, dates) {
  return (dispatch, getState) => {
    let indicatorsDates = Object.assign({}, getState().indicators.dates);

    if (dates) { // Add or update dates
      indicatorsDates[indicator] = dates;
    } else { // remove dates
      const newIndicatorsDates = {};
      Object.keys(indicatorsDates).forEach((key) => {
        if (`${key}` !== `${indicator}`) newIndicatorsDates[key] = indicatorsDates[key];
      });
      indicatorsDates = newIndicatorsDates;
    }

    dispatch({
      type: SET_INDICATOR_DATES,
      payload: indicatorsDates
    });
  };
}
