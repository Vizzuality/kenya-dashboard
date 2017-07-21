import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import Map from 'components/map/map';
import MapControls from 'components/map/map-controls';
import ZoomControl from 'components/ui/zoom-control';
import FitBoundsControl from 'components/ui/fit-bounds-control';

// Constants
import { MAP_OPTIONS, MAP_METHODS } from 'constants/map';

export default class AreaMap extends React.Component {
  setListeners(url, id, area) {
    return {
      moveend: (map) => {
        this.updateMap(map, url, id, area);
      }
    };
  }

  getMapOptions(area) {
    return {
      zoom: area.zoom,
      fitBounds: area.fitBounds,
      bounds: area.bounds,
      minZoom: MAP_OPTIONS.minZoom,
      maxZoom: MAP_OPTIONS.maxZoom,
      zoomControl: MAP_OPTIONS.zoomControl,
      center: [area.center.lat, area.center.lng]
    };
  }

  updateMap(map, url, id, area) {
    this.props.setSingleMapParams(
      {
        ...area,
        ...{
          zoom: map.getZoom(),
          center: map.getCenter(),
          key: id
        }
      },
      url, id);
  }

  render() {
    const { url, id, area, layers, layersActive, mapState } = this.props;
    const classNames = classnames(
      'c-area-map',
      { '-expanded': mapState.expanded }
    );
    const listeners = this.setListeners(url, id, area);
    const mapOptions = this.getMapOptions(area);

    return (
      <div className={classNames}>
        <MapControls>
          <ZoomControl
            zoom={mapState.areas[id].zoom}
            onZoomChange={(zoom) => {
              const newArea = { ...mapState.areas[id], ...{ zoom } };
              this.props.setSingleMapParams(newArea, url, id);
            }}
          />
          <FitBoundsControl
            fitAreaBounds={this.props.fitAreaBounds}
          />
        </MapControls>
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
  mapState: PropTypes.object,
  // Actions
  setSingleMapParams: PropTypes.func,
  fitAreaBounds: PropTypes.func
};
