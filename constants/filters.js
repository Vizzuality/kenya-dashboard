
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

const TOPICS_ICONS_CIRCLE_SRC = {
  agriculture: 'agriculture_circle',
  climate: 'climate_circle',
  conservancies: 'infrastructure_circle',
  contextual: 'population_circle',
  integration: 'poverty_circle',
  landcover: 'boundaries_circle',
  livestock: 'livestock_circle',
  protected_areas: 'protected_areas',
  protected_forests: 'forest_circle',
  socioeconomic: 'urban_circle',
  tourism: 'tourism_circle',
  water: 'water_circle',
  wildlife: 'wildlife_circle'
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
  protected_forests: 'forest',
  socioeconomic: 'urban',
  tourism: 'tourism',
  water: 'water',
  wildlife: 'wildlife'
};

const TOPICS_BACKGROUNDS_SRC = {
  agriculture: 'agriculture.jpg',
  climate: 'climate.jpg',
  conservancies: 'infrastructure.jpg',
  contextual: 'population.jpg',
  integration: 'poverty.jpg',
  landcover: 'boundaries.jpg',
  livestock: 'livestock.jpg',
  protected_areas: 'protected_areas.jpg',
  protected_forests: 'forest.jpg',
  socioeconomic: 'urban.jpg',
  tourism: 'tourism.jpg',
  water: 'water.jpg',
  wildlife: 'wildlife.jpg'
};

const KENYA_CARTO_ID = '779';

export {
  SORT_OPTIONS,
  REGIONS_OPTIONS,
  FILTERS_BAR_LABELS,
  KENYA_CARTO_ID,
  TOPICS_ICONS_SRC,
  TOPICS_ICONS_CIRCLE_SRC,
  TOPICS_BACKGROUNDS_SRC
};
