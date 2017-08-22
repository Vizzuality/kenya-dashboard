
const SORT_OPTIONS = [
  { id: 'name', name: 'Name ascendant (A-Z)' },
  { id: '-name', name: 'Name descendant (Z-A)' }
];
const REGIONS_OPTIONS = [
  { name: 'Country', id: 'country', list: [] },
  { name: 'County', id: 'county', list: [] },
  { name: 'Protected Area', id: 'pa', list: [] },
  { name: 'Water basin', id: 'waterb', list: [] }
];

const FILTERS_BAR_LABELS = {
  regions: 'Location',
  topics: 'Topics',
  sort: 'Sorted by'
};

const TOPICS_ICONS_SRC = {
  agriculture: 'agriculture',
  climate: 'climate',
  conservancies: 'infrastructure',
  contextual: 'population',
  integration: 'poverty',
  landcover: 'boundarie',
  livestock: 'livestock',
  protected_areas: 'protectedareas',
  protected_forests: 'landcover',
  socioeconomic: 'urban',
  water: 'water',
  wildlife: 'wildlife'
};

const TOPICS_BACKGROUNDS_SRC = {
  agriculture: 'agriculture.png',
  climate: 'climate.png',
  conservancies: 'infrastructure.png',
  contextual: 'population.png',
  integration: 'poverty.png',
  landcover: 'boundaries.png',
  livestock: 'livestock.png',
  protected_areas: 'protected_areas.png',
  protected_forests: 'forest.png',
  socioeconomic: 'urban.png',
  water: 'water.png',
  wildlife: 'wildlife.png'
};

const KENYA_CARTO_ID = '779';

export {
  SORT_OPTIONS,
  REGIONS_OPTIONS,
  FILTERS_BAR_LABELS,
  KENYA_CARTO_ID,
  TOPICS_ICONS_SRC,
  TOPICS_BACKGROUNDS_SRC
};
