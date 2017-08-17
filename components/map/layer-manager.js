/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */

// Utils
import { get } from 'utils/request';

let L;
if (typeof window !== 'undefined') {
  /* eslint-disable global-require */
  L = require('leaflet/dist/leaflet');
  /* eslint-enable global-require */
}


export default class LayerManager {

  /* Constructor */
  constructor(map, options = {}) {
    this._map = map;
    this._mapLayers = {};
    this._mapMarkers = {};
    this._onLayerAddedSuccess = options.onLayerAddedSuccess;
    this._onLayerAddedError = options.onLayerAddedError;
  }

  /* Public methods */
  addLayer(layer, opts = {}) {
    // const method = {
    //   cartodb: this._addCartoLayer
    // }[layer.attributes.provider];
    const method = this._addDefinedLayer;

    method && method.call(this, layer, opts);
  }

  removeLayer(layerId) {
    if (this._mapLayers[layerId]) {
      this._map.removeLayer(this._mapLayers[layerId]);
      delete this._mapLayers[layerId];
    }
  }

  removeAllLayers() {
    const layerIds = Object.keys(this._mapLayers);
    if (!layerIds.length) return;
    layerIds.forEach(id => this.removeLayer(id));
  }

  addMarker({ id, lat, lng }, icon) {
    this._mapMarkers[id] = L.marker([lat, lng], { icon });
    this._mapMarkers[id].addTo(this._map);
  }

  removeMarker(markerId) {
    if (this._mapMarkers[markerId]) {
      this._map.removeLayer(this._mapMarkers[markerId]);
      delete this._mapMarkers[markerId];
    }
  }

  updateMarker({ id, options }) {
    const { selected } = options;
    const markerIcon = this._mapMarkers[id]._icon;

    markerIcon.classList.toggle('-selected', selected);
  }

  /* Private methods */
  _addCartoLayer(layer) {
    const layerZIndex = layer.zIndex || 500;
    const layerConfig = layer.attributes.layerConfig;

    const onSuccess = (data, zIndex) => {
      const tileUrl = `${data.cdn_url.templates.https.url}/${layerConfig.account}/api/v1/map/${data.layergroupid}/{z}/{x}/{y}.png`;
      this._mapLayers[layer.id] = L.tileLayer(tileUrl).addTo(this._map).setZIndex(zIndex);
      this._mapLayers[layer.id].on('load', () => {
        this._onLayerAddedSuccess();
      });
      this._mapLayers[layer.id].on('tileerror', () => {
        this._onLayerAddedError();
      });
    };

    const layerTpl = {
      version: '1.3.0',
      stat_tag: 'API',
      ...layerConfig.body
    };
    const params = `stat_tag=API&config=${encodeURIComponent(JSON.stringify(layerTpl))}`;
    const request = get({
      url: `https://${layerConfig.account}.carto.com/api/v1/map?${params}`,
      onSuccess: data => onSuccess(data, layerZIndex),
      onError: this._onLayerAddedError
    });

    return request;
  }

  /* Add layer when tile url given */
  _addDefinedLayer(layer) {
    const layerZIndex = layer.zIndex || 500;
    const tileUrl = layer.url;

    this._mapLayers[layer.id] = L.tileLayer(tileUrl).addTo(this._map).setZIndex(layerZIndex);
    this._mapLayers[layer.id].on('load', () => {
      this._onLayerAddedSuccess();
    });
    this._mapLayers[layer.id].on('tileerror', () => {
      this._onLayerAddedError();
    });
  }
}
