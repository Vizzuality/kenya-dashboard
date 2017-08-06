
const HEADER_MENU_LINKS = [
  { label: 'Home', route: 'home' },
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
  fail: '#FF6161',
  medium: '#FFA26E',
  success: '#73A575'
};

export { HEADER_MENU_LINKS, SELECT_SEARCH_OPTIONS, THRESHOLD_COLORS };
