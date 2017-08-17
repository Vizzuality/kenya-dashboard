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
    // Add & remove indicators
    case ADD_INDICATOR:
      return Object.assign({}, state, { specific: action.payload });
    case REMOVE_INDICATOR:
      return Object.assign({}, state, { specific: action.payload });
    // All indicators filter list
    case GET_INDICATORS_FILTER_LIST: {
      const newList = {
        ...state.filterList.list,
        ...{ [action.payload.topic]: action.payload.list }
      };
      const newFilterList = { ...state.filterList, ...{ list: newList } };

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
    // case ADD_LAYER: {
    //   const newLayers = state.specific.layers.slice();
    //   newLayers.push(action.payload);
    //   const newSpecific = Object.assign({}, state.specific,
    //     { layers: newLayers, layersActive: newLayers.map(l => l.id) });
    //   return Object.assign({}, state, { specific: newSpecific });
    // }
    default:
      return state;
  }
}

/* Action creators */
export function getIndicators(filters) {
  const query = parseObjectToUrlParams(filters);

  return (dispatch) => {
    const headers = setBasicQueryHeaderHeaders({ Authorization: localStorage.getItem('token') });

    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_INDICATORS_LOADING });

    fetch(`${process.env.KENYA_API}/indicators?include=topic,widgets,agency&page[size]=999${query}`, headers)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        DESERIALIZER.deserialize(data, (err, dataParsed) => {
          dispatch({
            type: GET_INDICATORS,
            payload: dataParsed
          });
        });
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
  return (dispatch, getState) => {
    const headers = setBasicQueryHeaderHeaders({ Authorization: localStorage.getItem('token') });
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_SPECIFIC_INDICATORS_LOADING });

    fetch(`${process.env.KENYA_API}/indicators?filter[id]=${ids}&include=topic,widgets,agency&page[size]=999`, headers)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        DESERIALIZER.deserialize(data, (err, dataParsed) => {
          const state = getState().indicators;
          const indicatorsWithLayers = dataParsed.filter(ind => (
            ind.widgets && ind.widgets.length && ind.widgets.find(w => w['widget-type'] === 'layer')
          ));
          const layers = flattenDeep(indicatorsWithLayers.map(ind => getIndicatorLayers(ind)));

          // const layers = [];
          // indicatorsWithLayers.forEach((ind) => {
          //   getIndicatorLayers(ind).forEach((l) => { layers.push(l); });
          // });

          const newSpecific = Object.assign({}, state.specific,
            {
              list: dataParsed,
              loading: false,
              error: null,
              indicatorsWithLayers,
              layers,
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
    const headers = setBasicQueryHeaderHeaders({ Authorization: localStorage.getItem('token') });

    dispatch({ type: GET_SPECIFIC_INDICATORS_LOADING });

    fetch(`${process.env.KENYA_API}/indicators?id=${id}&page[size]=999`, headers)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        const specific = getState().indicators.specific;
        const hasLayers = data[0].widgets && data[0].widgets.length &&
          data[0].widgets.find(w => w['widget-type'] === 'layer');

        // Update state attributes with new data
        const list = data[0] ? [data[0]].concat(specific.list) : specific.list;

        const indicatorsWithLayers = hasLayers ?
          [data[0]].concat(specific.indicatorsWithLayers) :
          specific.indicatorsWithLayers;

        const indicatorLayers = flattenDeep(getIndicatorLayers(data[0]));
        const layers = indicatorLayers.concat(specific.layers);
        const layersActive = indicatorLayers.map(l => l.id).concat(specific.layersActive);

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
  return (dispatch, getState) => {
    const headers = setBasicQueryHeaderHeaders({ Authorization: localStorage.getItem('token') });
    const topics = getState().filters.options.topics;

    topics.forEach((topic) => {
      fetch(`${process.env.KENYA_API}/indicators?filter[topic_id]=${topic.id}&include=topic&page[size]=999`, headers)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        DESERIALIZER.deserialize(data, (err, dataParsed) => {
          dataParsed.length &&
            dispatch({
              type: GET_INDICATORS_FILTER_LIST,
              payload: {
                topic: dataParsed.length ? dataParsed[0].topic.name : '',
                list: dataParsed.map(i => ({ name: i.name, id: i.id }))
              }
            });
        });
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
