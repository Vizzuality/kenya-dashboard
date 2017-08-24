import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';

// Components
import Spinner from 'components/ui/spinner';

// Constants
import { MAP_OPTIONS } from 'constants/map';

// Layer Manager
import LayerManager from './layer-manager';


function addOrRemove(oldItems, newItems, addCb, removeCb, updateCb) {
  // TODO: improve performace uning sets instead of looping over arrays
  // Remove
  oldItems.forEach(i => !newItems.find(ii => i.id === ii.id) && removeCb(i));

  // Add
  newItems.forEach(i => !oldItems.find(ii => i.id === ii.id) && addCb(i));

  // Update
  newItems.forEach((i) => {
    const old = oldItems.find(ii => i.id === ii.id);
    if (!!updateCb && !!old && !isEqual(old, i)) {
      updateCb(i);
    }
  });
}

let L;
if (typeof window !== 'undefined') {
  /* eslint-disable global-require */
  L = require('leaflet/dist/leaflet');
  /* eslint-enable global-require */
}

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  /* Component Lifecyle */
  componentDidMount() {
    this._mounted = true;
    const mapOptions = Object.assign({}, MAP_OPTIONS, this.props.mapOptions);
    this.map = L.map(this.mapNode, mapOptions);
    this.setTileLayers();

    // Add event listeners
    this.props.listeners && this.setMapEventListeners();

    // Exec leaflet methods
    // this.execMethods();

    // Add layers
    this.initLayerManager();
    this.props.layers.length && this.addLayer(this.props.layers);
    this.props.mapOptions.bounds && this.setBounds(this.props.mapOptions.bounds.coordinates[0]);
  }

  componentWillReceiveProps(nextProps) {
    // Fitbounds
    if (!isEqual(this.props.mapOptions.bounds, nextProps.mapOptions.bounds)) {
      this.setBounds(nextProps.mapOptions.bounds.coordinates[0]);
    }

    // Layers
    // Add layers with new order
    if (!isEqual(this.props.layers, nextProps.layers) &&
      isEqual(this.props.indicatorsLayersActive, nextProps.indicatorsLayersActive)) {
      this.layerManager.removeAllLayers();
      this.addLayer(nextProps.layers);
    }

    if (!isEqual(this.props.indicatorsLayersActive, nextProps.indicatorsLayersActive)) {
      const added = difference(nextProps.indicatorsLayersActive, this.props.indicatorsLayersActive);
      const removed = difference(
        this.props.indicatorsLayersActive,
        nextProps.indicatorsLayersActive
      );
      added.length && this.addLayer(nextProps.layers.filter(l => added.includes(l.id)));

      // In case the indicator has being removed before de layer
      if (removed.length) {
        let layersToRemove = nextProps.layers.filter(l => removed.includes(l.id));
        if (!layersToRemove.length) {
          layersToRemove = this.props.layers.filter(l => removed.includes(l.id));
        }
        this.removeLayer(layersToRemove);
      }
    }

    // Markers
    if (!isEqual(this.props.markers, nextProps.markers)) {
      addOrRemove(
        this.props.markers,
        nextProps.markers,
        marker => this.addMarker(marker),
        marker => this.removeMarker(marker.id),
        marker => this.updateMarker(marker)
      );
    }
    // Zoom
    if (this.props.mapOptions.zoom !== nextProps.mapOptions.zoom) {
      this.map.setZoom(nextProps.mapOptions.zoom);
    }

    // Center
    if (!isEqual(this.props.mapOptions.center, nextProps.mapOptions.center)) {
      this.map.setView(
        new L.LatLng(
          nextProps.mapOptions.center[0],
          nextProps.mapOptions.center[1]
        ),
        nextProps.mapOptions.zoom
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const loadingChanged = this.state.loading !== nextState.loading;
    return loadingChanged;
  }

  componentWillUnmount() {
    this._mounted = false;
    this.props.listeners && this.removeMapEventListeners();
    this.map.remove();
  }

  /* Event listener methods */
  setMapEventListeners() {
    const { listeners } = this.props;
    Object.keys(listeners).forEach((eventName) => {
      this.map.on(eventName, (...args) => listeners[eventName](this.map, ...args));
    });
  }

  setTileLayers() {
    const { tileLayers } = this.props.mapMethods;
    tileLayers.forEach((tile) => {
      L.tileLayer(tile.url, tile.options || {}).addTo(this.map).setZIndex(tile.zIndex);
    });
  }

  setAttribution() {
    this.map.attributionControl.addAttribution(this.props.mapMethods.attribution);
  }

  setBounds(coordinates) {
    const latLngs = coordinates.map(b => L.latLng(b[1], b[0]));
    const bounds = L.latLngBounds(latLngs);
    this.map.fitBounds(bounds);
  }

  setZoomControlPosition() {
    this.map.zoomControl.setPosition(this.props.mapMethods.zoomControlPosition);
  }

  removeMapEventListeners() {
    const { listeners } = this.props;
    const eventNames = Object.keys[listeners];
    eventNames && eventNames.forEach(eventName => this.map.off(eventName));
  }

  /* LayerManager initialization */
  initLayerManager() {
    const stopLoading = () => {
      this._mounted && this.setState({
        loading: false
      });
    };

    this.layerManager = new LayerManager(this.map, {
      onLayerAddedSuccess: stopLoading,
      onLayerAddedError: stopLoading
    });
  }

  /* MapMethods methods */
  execMethods() {
    Object.keys(this.props.mapMethods).forEach((name) => {
      const methodName = name.charAt(0).toUpperCase() + name.slice(1);
      const fnName = `set${methodName}`;
      typeof this[fnName] === 'function' && this[fnName].call(this);
    });
  }

  /* Layer methods */
  addLayer(layer, opts) {
    this.setState({
      loading: true
    });
    if (Array.isArray(layer)) {
      layer.forEach(l => this.layerManager.addLayer(l, opts));
      return;
    }
    this.layerManager.addLayer(layer, opts);
  }

  removeLayer(layer) {
    if (Array.isArray(layer)) {
      layer.forEach(l => this.layerManager.removeLayer(l.id));
      return;
    }
    this.layerManager.removeLayer(layer.id);
  }

  /* Marker methods */
  addMarker(marker) {
    if (Array.isArray(marker)) {
      marker.forEach(m => this.layerManager.addMarker(m, this.props.markerIcon));
      return;
    }
    this.layerManager.addMarker(marker, this.props.markerIcon);
  }

  removeMarker(markerId) {
    this.layerManager.removeMarker(markerId);
  }

  updateMarker(marker) {
    this.layerManager.updateMarker(marker);
  }

  render() {
    const { className } = this.props;
    const classNames = classnames({
      'c-map': true,
      [className]: !!className
    });

    return (
      <div className={classNames}>
        <div ref={(node) => { this.mapNode = node; }} className="map-leaflet" />
        <Spinner isLoading={this.state.loading} />
      </div>
    );
  }
}

Map.propTypes = {
  className: PropTypes.string,
  mapOptions: PropTypes.object,
  mapMethods: PropTypes.object,
  layers: PropTypes.array,
  indicatorsLayersActive: PropTypes.array,
  markers: PropTypes.array,
  markerIcon: PropTypes.object,
  listeners: PropTypes.object
};

Map.defaultProps = {
  mapOptions: {},
  mapMethods: {},
  layers: [],
  listeners: {},
  markers: []
};
