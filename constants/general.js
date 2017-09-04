const BREAKPOINT_MOBILE = 640;
const BREAKPOINT_TABLET = 1024;

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

const MONTHS_INITIALS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MONTHS_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const SLIDER_OPTIONS = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  draggable: false
};

export {
  BREAKPOINT_MOBILE,
  BREAKPOINT_TABLET,
  HEADER_MENU_LINKS,
  SELECT_SEARCH_OPTIONS,
  HEADER_LOGIN_MENU_LINKS,
  THRESHOLD_COLORS,
  THRESHOLD_EXAMPLE,
  MONTHS_INITIALS,
  MONTHS_NAMES,
  SLIDER_OPTIONS
};
