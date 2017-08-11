import React from 'react';
import Icon from 'components/ui/icon';

function getIndicatorLayers(indicator) {
  const mapWidgets = indicator.widgets.filter(w => w.widget_type === 'map');
  return mapWidgets.map(mw => mw.json_config.config);
}

function getTopicIcon(topic, className) {
  let name = 'icon-';
  switch (topic) {
    case '': name += 'cow'; break;
    default: name += 'plus';
  }
  return <Icon name={name} className={className} />;
}

function setIndicatorsWidgetsList(list, onlyDefaultWidget) {
  const extendedList = [];

  list.forEach((l) => {
    if (l.widgets && l.widgets.length) {
      if (onlyDefaultWidget) {
        const defaultWidget = l.widgets.find(w => w.default);
        defaultWidget && extendedList.push({ ...defaultWidget, ...{ updatedAt: l.updatedAt } });
      } else {
        l.widgets.forEach((w) => {
          extendedList.push({ ...w, ...{ updatedAt: l.updatedAt } });
        });
      }
    }
  });
  return extendedList;
}

export {
  getIndicatorLayers,
  getTopicIcon,
  setIndicatorsWidgetsList
};
