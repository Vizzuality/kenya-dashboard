
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
  wildlife: 'wildlife.svg'
};

const KENYA_CARTO_ID = '779';

export { SORT_OPTIONS, REGIONS_OPTIONS, FILTERS_BAR_LABELS, KENYA_CARTO_ID, TOPICS_ICONS_SRC };
