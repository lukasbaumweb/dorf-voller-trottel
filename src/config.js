const PIXEL_SIZE = 16;

export const CONFIG = {
  PIXEL_SIZE: PIXEL_SIZE,
  animationFrameLimit: 6,
  PLAYER_LAYER: '######players######',
  OFFSET: { x: -11, y: -6 },
  GAME_CONFIG: {
    width: 352,
    height: 198,
    scale: 4
  },
  textures: {
    hero: {
      img: 'public/textures/characters/hero.png',
      config: 'public/textures/characters/hero.json'
    },
    marker: { config: 'public/textures/utils/marker.json' },
    bigMarker: { config: 'public/textures/utils/big-marker.json' }
  },
  levels: {
    dorf: {
      id: 'dorf',
      width: 30,
      height: 20,
      map: {
        config: 'public/maps/dorf/dorf.json',
        lowerImage: 'public/maps/dorf/dorf.png',
        upperImage: 'public/maps/dorf/dorf-upper.png'
      },
      configObjects: {
        hero: {
          type: 'Character',
          isPlayerControlled: true,
          x: 6 * PIXEL_SIZE,
          y: 24 * PIXEL_SIZE,
          index: 5
        }
      },
      markerObjects: {
        homeMarker: {
          type: 'Marker',
          x: 6 * PIXEL_SIZE + 8,
          y: 23 * PIXEL_SIZE + 8
        },
        largehouseMarker: {
          type: 'Marker',
          x: 12 * PIXEL_SIZE + 8,
          y: 9 * PIXEL_SIZE + 8
        },
        churchMarker: {
          type: 'Marker',
          x: 21 * PIXEL_SIZE,
          y: 6 * PIXEL_SIZE + 8,
          isBig: true
        },
        smallMarker: {
          type: 'Marker',
          x: 26 * PIXEL_SIZE + 8,
          y: 15 * PIXEL_SIZE + 8
        }
      }
    }
  }
};
