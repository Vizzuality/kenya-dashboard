import Router from 'next/router';

// Utils
import { encode } from 'utils/general';
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
const FIT_BOUNDS = 'FIT_BOUNDS';
// Layers
const ADD_LAYER = 'ADD_LAYER';
// indicators
const SET_AREA_INDICATOR_DATES = 'SET_AREA_INDICATOR_DATES';
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
  dates: {},
  removedWidgets: [],
  fitBounds: Date.now()
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
      return Object.assign({}, state, { areas: action.payload });
    }
    case SELECT_REGION: {
      return Object.assign({}, state, { areas: action.payload });
    }
    case REMOVE_AREA:
      return Object.assign({}, state, { areas: action.payload });
    case SET_AREA_INDICATOR_DATES:
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
    case FIT_BOUNDS: {
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
  return (dispatch, getState) => {
    const areas = getState().maps.areas;

    if (areas[key]) {
      dispatch({
        type: SET_MAP_PARAMS,
        payload: { [key]: params }
      });
    }
  };
}

export function setSingleMapParamsUrl(params, url) {
  return (dispatch, getState) => {
    const urlParams = getState().maps.areas;

    const newAreasParams = Object.assign({}, urlParams,
      {
        [params.key]: {
          center: params.center,
          zoom: params.zoom,
          region: params.region || KENYA_CARTO_ID
        }
      });
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
export function fitAreaBounds(area) {
  return (dispatch, getState) => {
    const areas = Object.assign({}, getState().maps.areas);
    areas[area].fitBounds = Date.now();
    dispatch({
      type: FIT_BOUNDS,
      payload: areas
    });
  };
}

// Areas
export function addArea(area, key) {
  return (dispatch, getState) => {
    const oldAreas = getState().maps.areas;
    const defaultArea = { ...DEFAULT_AREA_PARAMS, ...{ region: '' } };

    const newAreas = Object.assign({}, oldAreas, {
      [key || `area${Date.now()}`]: {
        ...defaultArea,
        ...oldAreas[key],
        ...area
      }
    });

    dispatch({
      type: ADD_AREA,
      payload: newAreas
    });
  };
}

export function addAreaWithRegion(region) {
  return (dispatch, getState) => {
    const newArea = Object.assign({}, DEFAULT_AREA_PARAMS, { region });
    const areas = Object.assign({}, getState().maps.areas, {
      [`area${Date.now()}`]: newArea
    });

    dispatch({
      type: ADD_AREA,
      payload: areas
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
    const areas = Object.assign({}, getState().maps.areas);
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
        dates: areas[key].dates || {},
        removedWidgets: areas[key].removedWidgets || [],
        fitBounds: areas[key].fitbounds || Date.now(),
        center: areas[key].center
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
    const token = getState().user.auth_token;
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

export function setAreaIndicatorDates(indicator, dates, area) {
  return (dispatch, getState) => {
    const newArea = Object.assign({}, getState().maps.areas[area]);

    if (dates) { // Add or update dates
      newArea.dates[indicator] = dates;
    } else { // remove dates
      const newAreaDates = {};

      Object.keys(newArea.dates).forEach((key) => {
        if (`${key}` !== `${indicator}`) newAreaDates[key] = newArea.dates[key];
      });

      newArea.dates = newAreaDates;
    }

    const newAreas = Object.assign({}, getState().maps.areas, { [area]: newArea });

    dispatch({
      type: SET_AREA_INDICATOR_DATES,
      payload: newAreas
    });
  };
}
