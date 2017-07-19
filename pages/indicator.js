import React from 'react';
import PropTypes from 'prop-types';

// Modules
import { getSpecificIndicators, setIndicatorsLayersActive, setIndicatorsLayers } from 'modules/indicators';
import {
  setSingleMapParams,
  setSingleMapParamsUrl
} from 'modules/single-map';

// Selectors
import { getIndicatorsLayers, getIndicatorsWithLayers } from 'selectors/indicators';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Utils
import { setLayersZIndex } from 'utils/map';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Map from 'components/map/map';
import Legend from 'components/map/legend';

// Constants
import { MAP_OPTIONS } from 'constants/map';


// let L;
// if (typeof window !== 'undefined') {
//   /* eslint-disable global-require */
//   L = require('leaflet/dist/leaflet');
//   /* eslint-enable global-require */
// }

class IndicatorPage extends Page {
  componentDidMount() {
    const { url } = this.props;

    this.props.getSpecificIndicators(url.query.indicators);

    if (url.query.zoom || url.query.lat || url.query.lng) {
      this.setMapParams();
    }
  }

  /* Config map params and set them in the map */
  setMapParams() {
    const { url } = this.props;
    const mapParams = {
      zoom: +url.query.zoom || MAP_OPTIONS.zoom,
      center: {
        lat: +url.query.lat || MAP_OPTIONS.center[0],
        lng: +url.query.lng || MAP_OPTIONS.center[1]
      }
    };
    this.props.setSingleMapParamsFromUrl(mapParams);
  }

  /* Map config */
  updateMap(map, urlObj) {
    this.props.setSingleMapParams({
      zoom: map.getZoom(),
      center: map.getCenter()
    }, urlObj);
  }

  render() {
    const { url, session, mapState, indicators } = this.props;
    const listeners = {
      moveend: (map) => {
        this.updateMap(map, this.props.url);
      }
    };

    const mapMethods = {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      tileLayers: [
        { url: process.env.BASEMAP_TILE_URL, zIndex: 0 },
        { url: process.env.BASEMAP_LABEL_URL, zIndex: 10000 }
      ]
    };
    const mapOptions = {
      zoom: mapState.zoom,
      minZoom: MAP_OPTIONS.minZoom,
      maxZoom: MAP_OPTIONS.maxZoom,
      zoomControl: MAP_OPTIONS.zoomControl,
      center: [mapState.center.lat, mapState.center.lng]
    };

    const layers = setLayersZIndex(indicators.layers, indicators.layersActive);

    return (
      <Layout
        title="Dashboard"
        description="Dashboard description..."
        url={url}
        session={session}
      >
        <h2>Sidebar</h2>
        <div>
          <Map
            mapOptions={mapOptions}
            mapMethods={mapMethods}
            listeners={listeners}
            layers={layers}
            indicatorsLayersActive={indicators.layersActive}
            markers={[]}
            markerIcon={{}}
          />
          <Legend
            list={layers}
            indicatorsLayersActive={indicators.layersActive}
            setIndicatorsLayersActive={this.props.setIndicatorsLayersActive}
            setIndicatorsLayers={this.props.setIndicatorsLayers}
          />
        </div>
      </Layout>
    );
  }
}

IndicatorPage.propTypes = {
  url: PropTypes.object,
  session: PropTypes.object
};

export default withRedux(
  store,
  state => (
    {
      indicators: Object.assign(
        {},
        state.indicators.specific,
        { indicatorsWithLayers: getIndicatorsWithLayers(state) }
      ),
      mapState: state.singleMap
    }
  ),
  dispatch => ({
    getSpecificIndicators(ids) {
      dispatch(getSpecificIndicators(ids));
    },
    setSingleMapParams(params, url) {
      dispatch(setSingleMapParams(params));
      dispatch(setSingleMapParamsUrl(params, url));
    },
    setSingleMapParamsFromUrl(params) {
      dispatch(setSingleMapParams(params));
    },
    setIndicatorsLayersActive(indicatorsLayersActive) {
      dispatch(setIndicatorsLayersActive(indicatorsLayersActive));
    },
    setIndicatorsLayers(indicatorsIayers) {
      dispatch(setIndicatorsLayers(indicatorsIayers));
    }
  })
)(IndicatorPage);
