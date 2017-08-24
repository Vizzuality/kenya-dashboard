import React from 'react';
import Icon from 'components/ui/icon';

function getIndicatorLayers(indicator) {
  return indicator.widgets.filter(w => w['widget-type'] === 'layer') || [];
}

function getTopicIcon(topic, className) {
  let name = 'icon-';
  switch (topic) {
    case '': name += 'cow'; break;
    default: name += 'plus';
  }
  return <Icon name={name} className={className} />;
}

function setIndicatorsWidgetsList(list, onlyDefaultWidget, removedWidgets) {
  const extendedList = [];

  list.forEach((l) => {
    if (l.widgets && l.widgets.length) {
      if (onlyDefaultWidget) {
        const defaultWidget = l.widgets.find(w => w.default);

        if (defaultWidget) {
          extendedList.push({
            ...defaultWidget,
            ...{ updatedAt: l.updatedAt, agency: l.agency, topic: l.topic, indicator_id: l.id }
          });
        } else {
          // extendedList.push({
          //   ...{ updatedAt: l.updatedAt, agency: l.agency, topic: l.topic, indicator_id: l.id }
          // });
        }
      } else {
        l.widgets.forEach((w) => {
          if (!removedWidgets || (removedWidgets && !removedWidgets.includes(w.id))) {
            w['widget-type'] !== 'layer' && extendedList.push({
              ...w,
              ...{ updatedAt: l.updatedAt, agency: l.agency, topic: l.topic, indicator_id: l.id }
            });
          }
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
