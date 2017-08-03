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

export {
  getIndicatorLayers,
  getTopicIcon
};
