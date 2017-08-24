import Router from 'next/router';

// Utils
import { encode, decode } from 'utils/general';
import { get } from 'utils/request';

// Constants
import { MAP_OPTIONS } from 'constants/map';
import { KENYA_CARTO_ID } from 'constants/filters';

/* Constants */
const RESET_AREAS = 'RESET_AREAS';
const SET_MAP_PARAMS = 'SET_MAP_PARAMS';
const SET_MAP_EXPANSION = 'SET_MAP_EXPANSION';
const ADD_AREA = 'ADD_AREA';
const SELECT_REGION = 'SELECT_REGION';
const REMOVE_AREA = 'REMOVE_AREA';
// Layers
const ADD_LAYER = 'ADD_LAYER';
// Widgets
const REMOVE_WIDGET = 'REMOVE_WIDGET';
const REMOVE_WIDGETS_IDS = 'REMOVE_WIDGETS_IDS';


const DEFAULT_AREA_PARAMS = {
  center: {
    lat: MAP_OPTIONS.center[0],
    lng: MAP_OPTIONS.center[1]
  },
  zoom: MAP_OPTIONS.zoom,
  region: KENYA_CARTO_ID,
  layers: {},
  removedWidgets: []
};

/* Initial state */
const initialState = {
  areas: {
    defaultAreaMap: DEFAULT_AREA_PARAMS
  },
  expanded: false
};

/* Reducer */
export default function mapsReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_AREAS:
      return Object.assign({}, state, { areas: action.payload });
    case SET_MAP_PARAMS: {
      const newAreaParams = Object.assign({}, state.areas, action.payload);
      return Object.assign({}, state, { areas: newAreaParams });
    }
    case SET_MAP_EXPANSION:
      return Object.assign({}, state, { expanded: action.payload });
    case ADD_AREA: {
      const newAreaParams = Object.assign({}, state.areas, {
        [Math.random()]: DEFAULT_AREA_PARAMS
      });
      return Object.assign({}, state, { areas: newAreaParams });
    }
    case SELECT_REGION: {
      return Object.assign({}, state, { areas: action.payload });
    }
    case REMOVE_AREA:
      return Object.assign({}, state, { areas: action.payload });
    case ADD_LAYER: {
      const newAreas = Object.assign({}, state.areas, action.payload);
      return Object.assign({}, state, { areas: newAreas });
    }
    case REMOVE_WIDGET: {
      const newAreas = Object.assign({}, state.areas, action.payload);
      return Object.assign({}, state, { areas: newAreas });
    }
    case REMOVE_WIDGETS_IDS: {
      const newAreas = Object.assign({}, state.areas, action.payload);
      return Object.assign({}, state, { areas: newAreas });
    }
    default:
      return state;
  }
}


/* Action creators */
/* Reset areas */
export function resetAreas() {
  return (dispatch) => {
    dispatch({
      type: RESET_AREAS,
      payload: { defaultAreaMap: DEFAULT_AREA_PARAMS }
    });
  };
}

export function setSingleMapParams(params, key) {
  return (dispatch) => {
    dispatch({
      type: SET_MAP_PARAMS,
      payload: { [key]: params }
    });
  };
}

export function setSingleMapParamsUrl(params, url) {
  return () => {
    const urlParams = url.query.maps ? decode(url.query.maps) : {};
    const newAreasParams = Object.assign({}, urlParams,
      { [params.key]: {
        lat: params.center.lat,
        lng: params.center.lng,
        zoom: params.zoom,
        region: params.region || KENYA_CARTO_ID
      } });
    const location = {
      pathname: url.pathname,
      query: Object.assign({}, url.query, { maps: encode(newAreasParams) })
    };

    Router.replace(location);
  };
}

export function setMapExpansion(expand) {
  return (dispatch) => {
    dispatch({
      type: SET_MAP_EXPANSION,
      payload: !!expand
    });
  };
}

export function setMapExpansionUrl(expanded, url) {
  return () => {
    const newQuery = {};

    Object.keys(url.query).forEach((key) => {
      if (key !== 'expanded') {
        newQuery[key] = url.query[key];
      }
    });
    if (expanded) newQuery.expanded = true;

    const location = { pathname: url.pathname, query: newQuery };

    Router.replace(location);
  };
}

// Fit area bounds
export function fitAreaBounds() {
  return () => {
  };
}

// Areas
export function addArea() {
  return (dispatch) => {
    dispatch({
      type: ADD_AREA
    });
  };
}

export function selectRegion(region, area) {
  return (dispatch, getState) => {
    const newArea = Object.assign({}, getState().maps.areas[area], { region });
    const newAreas = Object.assign({}, getState().maps.areas, { [area]: newArea });

    dispatch({
      type: SELECT_REGION,
      payload: newAreas
    });
  };
}

export function removeArea(id) {
  return (dispatch, getState) => {
    const areas = getState().maps.areas;
    const activeIds = Object.keys(areas).filter(key => key !== id);
    const newAreas = {};
    activeIds.forEach((aId) => {
      newAreas[aId] = areas[aId];
    });

    dispatch({
      type: REMOVE_AREA,
      payload: newAreas
    });
  };
}

export function setAreasParamsUrl(url) {
  return (dispatch, getState) => {
    const areas = getState().maps.areas;
    const newAreas = {};

    Object.keys(areas).forEach((key) => {
      newAreas[key] = {
        zoom: areas[key].zoom,
        region: areas[key].region,
        layers: areas[key].layers || {},
        removedWidgets: areas[key].removedWidgets || [],
        lat: areas[key].center.lat,
        lng: areas[key].center.lng
      };
    });

    const location = {
      pathname: url.pathname,
      query: Object.assign({}, url.query, { maps: encode(newAreas) })
    };

    Router.replace(location);
  };
}

/* Area layers */
// Add layer
export function addLayer(layer, area, region, dates) {
  return (dispatch, getState) => {
    const token = localStorage.getItem('token');
    const url = 'https://cdb.resilienceatlas.org/user/kenya/api/v2/sql';
    let params = `'${token}', ${layer.id}`;

    if (region && region !== '') params += `, '${region}'`;

    if (dates) {
      const start = `${dates.start.year}-${dates.start.month}-${dates.start.day}`;
      const end = `${dates.end.year}-${dates.end.month}-${dates.end.day}`;
      params += `, '${start}', '${end}'`;
    }

    const query = `select * from get_widget(${params})`;
    get({
      url: `${url}?q=${query}`,
      onSuccess: (data) => {
        const newLayers = Object.assign({}, getState().maps.areas[area].layers);
        if (newLayers[layer.id]) { // Update url
          newLayers[layer.id].url = data.rows[0].data[0].url;
        } else { // Add new layer
          newLayers[layer.id] = { id: layer.id, url: data.rows[0].data[0].url };
        }

        const newArea = {
          ...getState().maps.areas[area],
          ...{ layers: newLayers }
        };

        dispatch({
          type: ADD_LAYER,
          payload: { [area]: newArea }
        });
      }
    });
  };
}

export function removeWidget(widgetId, areaId) {
  return (dispatch, getState) => {
    const areas = Object.assign({}, getState().maps.areas);
    const newRemovedWidgets = areas[areaId].removedWidgets || [];
    newRemovedWidgets.push(widgetId);
    areas[areaId].removedWidgets = newRemovedWidgets;

    dispatch({
      type: REMOVE_WIDGET,
      payload: areas
    });
  };
}

// Remove all indicators widgets ids from removed widgets attr in all areas
export function removeWidgetsIds(widgetsIds) {
  return (dispatch, getState) => {
    const areas = Object.assign({}, getState().maps.areas);

    Object.keys(areas).forEach((key) => {
      const removedWidgets = areas[key].removedWidgets ?
        areas[key].removedWidgets.filter(id => !widgetsIds.includes(id)) :
        [];
      areas[key].removedWidgets = removedWidgets;
    });

    dispatch({
      type: REMOVE_WIDGETS_IDS,
      payload: areas
    });
  };
}
