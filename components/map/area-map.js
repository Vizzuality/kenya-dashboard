import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';

// Utils
import { decode } from 'utils/general';

// Components
import Map from 'components/map/map';
import MapControls from 'components/map/map-controls';
import ZoomControl from 'components/ui/zoom-control';
import FitBoundsControl from 'components/ui/fit-bounds-control';

// Constants
import { MAP_OPTIONS, MAP_METHODS } from 'constants/map';

export default class AreaMap extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onFitBounds = this.onFitBounds.bind(this);
    this.updateMap = this.updateMap.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.layers.length && nextProps.layers.length) {
      nextProps.layers.forEach((l) => {
        this.props.addLayer(l, nextProps.id, nextProps.area.region, nextProps.dates[l['indicator-id']]);
      });
    }

    if (this.props.area.region !== nextProps.area.region ||
      !isEqual(this.props.dates, nextProps.dates)) {
      nextProps.layers.forEach((l) => {
        this.props.addLayer(l, nextProps.id, nextProps.area.region, nextProps.dates[l['indicator-id']]);
      });
    }
  }

  onFitBounds() {
    this.props.fitAreaBounds(this.props.id);
  }

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
      fitBounds: area.fitBounds,
      bounds: this.props.bounds,
      minZoom: MAP_OPTIONS.minZoom,
      maxZoom: MAP_OPTIONS.maxZoom,
      zoomControl: MAP_OPTIONS.zoomControl,
      center: [area.center.lat, area.center.lng]
    };
  }

  updateMap(map, url, id) {
    if (url.query.maps) {
      const maps = decode(url.query.maps);
      if (id && maps[id]) {
        // const area = {
        //   ...this.props.area,
        //   ...{
        //     zoom: map.getZoom(),
        //     center: map.getCenter(),
        //     key: id
        //   }
        // };
        // this.props.setSingleMapParams(
        //   area,
        //   url, id);
      }
    }
  }

  render() {
    const { url, id, area, layers, layersActive, mapState } = this.props;
    const classNames = classnames(
      'c-area-map',
      { '-expanded': mapState.expanded }
    );
    const listeners = this.setListeners(url, id);
    const mapOptions = this.getMapOptions(area);
    const parsedLayers = layers.map(l => Object.assign({}, l, {
      url: area.layers && area.layers[l.id] ? area.layers[l.id].url : ''
    }));

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
            fitAreaBounds={this.onFitBounds}
          />
        </MapControls>
        <Map
          mapOptions={mapOptions}
          mapMethods={MAP_METHODS}
          listeners={listeners}
          layers={parsedLayers}
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
  dates: PropTypes.object,
  layers: PropTypes.array,
  layersActive: PropTypes.array,
  mapState: PropTypes.object,
  bounds: PropTypes.object,
  // Actions
  setSingleMapParams: PropTypes.func,
  fitAreaBounds: PropTypes.func,
  addLayer: PropTypes.func
};
