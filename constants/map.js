
const MAP_OPTIONS = {
  zoom: 2,
  minZoom: 2,
  maxZoom: 8,
  center: [30, -25],
  zoomControl: false,
  detectRetina: true,
  scrollWheelZoom: false
};

const MAP_METHODS = {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  tileLayers: [
    { url: process.env.BASEMAP_TILE_URL, zIndex: 0 },
    { url: process.env.BASEMAP_LABEL_URL, zIndex: 10000 }
  ]
};

const GENERIC_ZINDEX = 500;

export {
  MAP_OPTIONS,
  MAP_METHODS,
  GENERIC_ZINDEX
};
