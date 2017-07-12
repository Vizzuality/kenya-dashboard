import { createSelector } from 'reselect';

// Libraries
import uniqBy from 'lodash/uniqBy';

// Get specific indicators
const specificIndicators = state => state.indicators.specific.list;

/* Get all selected indicators first layer if they have anyone */
const getIndicatorsLayers = createSelector(
  specificIndicators,
  (indicators) => {
    const layers = [];

    if (indicators.length) {
      indicators.forEach((ind) => {
        ind.layers && ind.layers.length && layers.push(ind.layers[0]);
      });
    }

    // Order layers
    // if (_specificLayersActive.length) layers = this.orderLayers(layers);

    return uniqBy(layers, l => l.id);
  }
);

/* Get all selected indicators first layer if they have anyone */
const getIndicatorsWithLayers = createSelector(
  specificIndicators,
  (indicators) => {
    return indicators.filter(ind => ind.layers && ind.layers.length);
  }
);

// Export the selector
export { getIndicatorsLayers, getIndicatorsWithLayers };
