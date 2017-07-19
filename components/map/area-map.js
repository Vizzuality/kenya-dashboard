import React from 'react';
import PropTypes from 'prop-types';

// Components
import Map from 'components/map/map';

// Constants
import { MAP_OPTIONS, MAP_METHODS } from 'constants/map';

export default class AreaMap extends React.Component {
  setListeners(url, id) {
    return {
      moveend: (map) => {
        this.updateMap(map, url, id);
      }
    };
  }

  getMapOptions(area) {
    return {
      zoom: area.zoom,
      minZoom: MAP_OPTIONS.minZoom,
      maxZoom: MAP_OPTIONS.maxZoom,
      zoomControl: MAP_OPTIONS.zoomControl,
      center: [area.center.lat, area.center.lng]
    };
  }

  updateMap(map, url, id) {
    this.props.setSingleMapParams(
      {
        zoom: map.getZoom(),
        center: map.getCenter(),
        key: id
      }, url, id);
  }

  render() {
    const { url, id, area, layers, layersActive } = this.props;
    const listeners = this.setListeners(url, id);
    const mapOptions = this.getMapOptions(area);

    return (
      <Map
        mapOptions={mapOptions}
        mapMethods={MAP_METHODS}
        listeners={listeners}
        layers={layers}
        indicatorsLayersActive={layersActive}
        markers={[]}
        markerIcon={{}}
      />
    );
  }
}

AreaMap.propTypes = {
  url: PropTypes.object,
  id: PropTypes.string,
  area: PropTypes.object,
  layers: PropTypes.array,
  layersActive: PropTypes.array,
  // Actions
  setSingleMapParams: PropTypes.func
};
