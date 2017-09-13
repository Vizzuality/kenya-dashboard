// Constants
import { GENERIC_ZINDEX } from 'constants/map';

/* Set layers z index */
export function setLayersZIndex(layers, layersActive) {
  return layers.filter(l => l).map((l, i) => {
    return {
      ...l,
      zIndex: layersActive.includes(l.id) ? GENERIC_ZINDEX + i : -1
    };
  });
}

  /* Order indicators by legend position */
export function orderLayers(layers, layersActive) {
  const orderedLayers = layers.filter(l => (
    !layersActive.includes(l.id)
  ));
  layersActive.forEach((id) => {
    const layer = layers.find(l => l.id === id);
    layer && orderedLayers.unshift(layer);
  });
  return orderedLayers;
}
