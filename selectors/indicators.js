import { createSelector } from 'reselect';

// Libraries
import uniqBy from 'lodash/uniqBy';

// Get specific indicators
const getSpecificIndicators = state => state.indicators.specific.list;
const getAllIndicators = state => state.indicators.list;

/* Get all selected indicators first layer if they have anyone */
const getIndicatorsLayers = createSelector(
  getSpecificIndicators,
  (indicators) => {
    const layers = [];

    if (indicators.length) {
      indicators.forEach((ind) => {
        ind.layers && ind.layers.length && layers.push(ind.layers[0]);
      });
    }

    return uniqBy(layers, l => l.id);
  }
);

/* Get all selected indicators first layer if they have anyone */
const getIndicatorsWithLayers = createSelector(
  getSpecificIndicators,
  (indicators) => {
    return indicators.filter(ind => ind.layers && ind.layers.length);
  }
);

/* Get all selected indicators with widgets */
const getIndicatorsWithWidgets = createSelector(
  getAllIndicators,
  (indicators) => {
    const topicsList = {};

    indicators.forEach((ind) => {
      if (ind.widgets && ind.widgets.length) {
        const indicator = { name: ind.name, id: ind.id };
        if (topicsList[ind.topic.name]) {
          topicsList[ind.topic.name].push(indicator);
        } else topicsList[ind.topic.name] = [indicator];
      }
    });
    return { list: topicsList };
  }
);

// Export the selector
export { getIndicatorsLayers, getIndicatorsWithLayers, getIndicatorsWithWidgets };
