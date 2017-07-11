import React from 'react';
import PropTypes from 'prop-types';

// Modules
import { getSpecificIndicators } from 'modules/indicators';
import { setSingleMapParams, setSingleMapParamsUrl, setLayersActive } from 'modules/single-map';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Libraries
import uniqBy from 'lodash/uniqBy';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Map from 'components/map/map';
import Legend from 'components/map/legend';

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

    // Bindings
  }

  componentDidMount() {
    const { url } = this.props;

    this.props.getSpecificIndicators(url.query.indicators);

    if (url.query.zoom || url.query.lat || url.query.lng) {
      this.setParams();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.indicators.list.length && nextProps.indicators.list.length) {
      const layersActive = this.getLayers(nextProps.indicators.list).map(l => l.id);
      this.props.setLayersActive(layersActive);
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

  getLayers(indicators) {
    const { url } = this.props;
    const layers = [];

    if (indicators.length) {
      const indicatorsOrder = url.query.indicators.split(',');

      indicatorsOrder.forEach((id) => {
        const ind = indicators.find(itr => `${itr.id}` === `${id}`);
        ind && ind.layers && ind.layers.length && layers.push(ind.layers[0]);
      });
    }

    return this.setLayersZIndex(uniqBy(layers, l => l.id));
  }

  setLayersZIndex(layers) {
    return layers.reverse().map((l, i) => Object.assign({}, l,
      { zIndex: this.props.mapState.layersActive.includes(l.id) ? GENERIC_ZINDEX + i : -1 }));
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
    const layers = this.getLayers(this.props.indicators.list);
    // const layersActive = layers.filter(l => mapState.layersActive.includes(l.id));

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
            layersActive={this.props.mapState.layersActive}
            markers={[]}
            markerIcon={{}}
          />
          <Legend
            list={layers}
            layersActive={this.props.mapState.layersActive}
            setLayersActive={this.props.setLayersActive}
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
    },
    setLayersActive(layersActive) {
      dispatch(setLayersActive(layersActive));
    }
  })
)(IndicatorPage);
