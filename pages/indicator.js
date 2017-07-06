import React from 'react';
import PropTypes from 'prop-types';

// Modules
import { getSpecificIndicators } from 'modules/indicators';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Map from 'components/map/map';

let L;
if (typeof window !== 'undefined') {
  /* eslint-disable global-require */
  L = require('leaflet/dist/leaflet');
  /* eslint-enable global-require */
}

class IndicatorPage extends Page {
  componentDidMount() {
    if (!this.props.indicators.list.length) {
      this.props.getSpecificIndicators(this.props.url.query.indicators);
    }
  }

  render() {
    const { url, session, indicators } = this.props;

    /* Map config */
    // const updateMap = (map) => {
    //   this.props.setMapParams({
    //     zoom: map.getZoom(),
    //     latLng: map.getCenter()
    //   });
    // };

    // const addPoint = (map, opts) => {
    //   this.props.addPoint(opts.latlng);
    // };
    const listeners = {
      // moveend: updateMap,
      // click: addPoint
    };

    const mapMethods = {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      tileLayers: [
        { url: process.env.BASEMAP_LABEL_URL, zIndex: 10000 },
        { url: process.env.BASEMAP_TILE_URL, zIndex: 0 }
      ]
    };

    const mapOptions = {
      zoom: 8,
      // zoom: this.props.mapState.zoom,
      minZoom: 2,
      maxZoom: 7,
      zoomControl: false,
      center: [40, 40]
      // center: [this.props.mapState.latLng.lat, this.props.mapState.latLng.lng]
    };

    // const markerIcon = L.divIcon({
    //   className: 'c-marker',
    //   html: '<div class="marker-inner"></div>'
    // });

    const layers = [];
    indicators.list.forEach(ind => ind.layers.length && layers.push(ind.layers[0].attributes));

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
            layers={layers || []}
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
    indicators: state.indicators.specific
  }),
  dispatch => ({
    getSpecificIndicators(ids) {
      dispatch(getSpecificIndicators(ids));
    }
  })
)(IndicatorPage);
