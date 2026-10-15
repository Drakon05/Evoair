export const fillFormulas = [
  {
    id: 'foundation',
    name: 'Foundation',
    price: '₹2,800',
    note: '10 skin-tone capsules · 15 ml',
    shades: [
      { code: '02', name: 'Halo', color: '#d8a978' },
      { code: '03', name: 'Flare', color: '#e7b894' },
      { code: '06', name: 'Serene', color: '#d19a57' },
      { code: '07', name: 'Astra', color: '#b18368' },
      { code: '10', name: 'Amber', color: '#c98a4a' },
      { code: '11', name: 'Dawn', color: '#b87543' },
      { code: '14', name: 'Cosmic', color: '#9b621f' },
      { code: '15', name: 'Stardusk', color: '#a96e3b' },
      { code: '18', name: 'Galaxy', color: '#8a542e' },
      { code: '19', name: 'Nebula', color: '#61341f' },
    ],
  },
  {
    id: 'blush',
    name: 'Blush',
    price: '₹2,500',
    note: '5 soft-focus color capsules · 15 ml',
    shades: [
      { code: 'B01', name: 'Terra Nova', color: '#a84f34' },
      { code: 'B02', name: 'Sun Halo', color: '#ec7554' },
      { code: 'B03', name: 'Stellar Rose', color: '#d75068' },
      { code: 'B04', name: 'Comet Glow', color: '#e53935' },
      { code: 'B05', name: 'Pink Constellation', color: '#e98676' },
    ],
  },
  {
    id: 'highlighter',
    name: 'Highlighter',
    price: '₹2,650',
    note: '5 luminous finish capsules · 15 ml',
    shades: [
      { code: 'H01', name: 'Moonveil', color: '#e9d9c6' },
      { code: 'H02', name: 'Cosmic Bronze', color: '#c7774a' },
      { code: 'H03', name: 'Sun Halo', color: '#dca46a' },
      { code: 'H04', name: 'Celestial Glow', color: '#e8c79d' },
      { code: 'H05', name: 'Rose Nebula', color: '#df8e9b' },
    ],
  },
];

export const defaultShadeByFormula = {
  foundation: fillFormulas[0].shades[0],
  blush: fillFormulas[1].shades[1],
  highlighter: fillFormulas[2].shades[0],
};
