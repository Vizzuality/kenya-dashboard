
function getIndicatorLayers(indicator) {
  const mapWidgets = indicator.widgets.filter(w => w.widget_type === 'map');
  return mapWidgets.map(mw => mw.json_config.config);
}

export {
  getIndicatorLayers
};
