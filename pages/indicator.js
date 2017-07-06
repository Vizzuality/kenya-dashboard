import React from 'react';
import PropTypes from 'prop-types';

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
  L.labelUrl = process.env.BASEMAP_LABEL_URL;
  L.tileUrl = process.env.BASEMAP_TILE_URL;
  /* eslint-enable global-require */
}

class IndicatorPage extends Page {
  render() {
    const { url, session } = this.props;

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
        // { url: process.env.BASEMAP_LABEL_URL, zIndex: 0 },
        { url: process.env.BASEMAP_TILE_URL, zIndex: 1000 }
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
            layers={this.props.layersActive || []}
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
  store
)(IndicatorPage);
