import React from 'react';
import PropTypes from 'prop-types';

// Modules
import { getSpecificIndicators } from 'modules/indicators';
import { setSingleMapParams, setSingleMapParamsUrl } from 'modules/single-map';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Map from 'components/map/map';

// Constants
import { GENERIC_ZINDEX, MAP_OPTIONS } from 'constants/map';


// let L;
// if (typeof window !== 'undefined') {
//   /* eslint-disable global-require */
//   L = require('leaflet/dist/leaflet');
//   /* eslint-enable global-require */
// }

class IndicatorPage extends Page {
  constructor(props) {
    super(props);

    this.update = true;
  }

  componentDidMount() {
    const { url } = this.props;

    this.props.getSpecificIndicators(url.query.indicators);

    if (url.query.zoom || url.query.lat || url.query.lng) {
      this.setParams();
    }
  }

  setParams() {
    const { url } = this.props;
    const mapParams = {
      zoom: +url.query.zoom || MAP_OPTIONS.zoom,
      center: {
        lat: +url.query.lat || MAP_OPTIONS.center[0],
        lng: +url.query.lng || MAP_OPTIONS.center[1]
      }
    };
    this.update = false;
    this.props.setSingleMapParamsFromUrl(mapParams);
  }

  getLayers() {
    const { url, indicators } = this.props;
    const layers = [];

    if (indicators.list.length) {
      const indicatorsOrder = url.query.indicators.split(',');

      indicatorsOrder.forEach((id) => {
        const ind = indicators.list.find(itr => `${itr.id}` === `${id}`);
        ind && ind.layers && ind.layers.length && layers.push(ind.layers[0].attributes);
      });
    }

    return layers;
  }

  setLayersZIndex(layers) {
    return layers.reverse().map((l, i) => Object.assign({}, l, { zIndex: GENERIC_ZINDEX + i }));
  }

  /* Map config */
  updateMap(map, urlObj) {
    this.props.setSingleMapParams({
      zoom: map.getZoom(),
      center: map.getCenter()
    }, urlObj);
  }

  render() {
    const { url, session } = this.props;

    const listeners = {
      moveend: (map) => {
        this.update && this.updateMap(map, this.props.url);
        if (!this.update) this.update = true;
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
      zoom: this.props.mapState.zoom,
      minZoom: MAP_OPTIONS.minZoom,
      maxZoom: MAP_OPTIONS.maxZoom,
      zoomControl: MAP_OPTIONS.zoomControl,
      center: [this.props.mapState.center.lat, this.props.mapState.center.lng]
    };
    const layers = this.setLayersZIndex(this.getLayers());

    return (
      <Layout
        title="Panel"
        description="Panel description..."
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
            markers={[]}
            markerIcon={{}}
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
  state => ({
    indicators: state.indicators.specific,
    mapState: state.singleMap
  }),
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
    }
  })
)(IndicatorPage);
