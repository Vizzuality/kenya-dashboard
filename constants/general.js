
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

export { HEADER_MENU_LINKS, SELECT_SEARCH_OPTIONS };
