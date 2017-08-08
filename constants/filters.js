
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

export { SORT_OPTIONS, REGIONS_OPTIONS };
