
const HEADER_MENU_LINKS = [
  { label: 'Home', route: 'home' },
  { label: 'Dashboard', route: 'dashboard' },
  { label: 'About the Alliance', route: 'about' }
];

const HEADER_LOGIN_MENU_LINKS = [
  { label: 'Dashboard', route: 'dashboard' },
  { label: 'About the Alliance', route: 'about' }
];

const SELECT_SEARCH_OPTIONS = {
  shouldSort: true,
  threshold: 0.6,
  maxPatternLength: 50,
  minMatchCharLength: 1,
  keys: ['name', 'label']
};

const THRESHOLD_COLORS = {
  unknown: '#EAEAEA',
  fail: '#FF6161',
  weak: '#FF6165',
  medium: '#FFA26E',
  good: '#FFA28E',
  success: '#73A575'
};

const THRESHOLD_EXAMPLE = {
  1: 50,
  2: 80
};

export {
  HEADER_MENU_LINKS,
  SELECT_SEARCH_OPTIONS,
  HEADER_LOGIN_MENU_LINKS,
  THRESHOLD_COLORS,
  THRESHOLD_EXAMPLE
};
