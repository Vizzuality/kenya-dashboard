import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import Map from 'components/map/map';
import MapControls from 'components/map/map-controls';

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
    const { url, id, area, layers, layersActive, expanded } = this.props;
    const classNames = classnames(
      'c-area-map',
      { '-expanded': expanded }
    );
    const listeners = this.setListeners(url, id);
    const mapOptions = this.getMapOptions(area);

    return (
      <div className={classNames}>
        <MapControls
        />
        <Map
          mapOptions={mapOptions}
          mapMethods={MAP_METHODS}
          listeners={listeners}
          layers={layers}
          indicatorsLayersActive={layersActive}
          markers={[]}
          markerIcon={{}}
        />
      </div>
    );
  }
}

AreaMap.propTypes = {
  url: PropTypes.object,
  id: PropTypes.string,
  area: PropTypes.object,
  layers: PropTypes.array,
  layersActive: PropTypes.array,
  expanded: PropTypes.bool,
  // Actions
  setSingleMapParams: PropTypes.func
};
