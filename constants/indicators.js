const EXAMPLE_QUERY_DATA = {
  threshold: 129
};

const CATEGORY_COLORS = [
  '#734CD4',
  '#79B336',
  '#F05B00',
  '#59D4D9',
  '#E4C12F',
  '#EC3C73'
];

const THRESHOLD_CATEGORY_COLORS = {
  fail: [
    '#9A0000',
    '#FF6161',
    '#F38E8E',
    '#F5D7D7',
    '#DFD3D3'
  ],
  medium: [
    '#D16F00',
    '#FFA43D',
    '#F9B161',
    '#FFD9AE',
    '#DCD0C2'
  ],
  success: [
    '#7FC829',
    '#B2F563',
    '#C9FF8A',
    '#C2D6AB',
    '#C2D6AB'
  ],
  'no-data': [
    '#000000',
    '#4C4B4B',
    '#858585',
    '#BFBFBF',
    '#FFFFFF'
  ]
};

export { EXAMPLE_QUERY_DATA, CATEGORY_COLORS, THRESHOLD_CATEGORY_COLORS };
