const PIXEL_SIZE = 16;

export const CONFIG = {
  PIXEL_SIZE: PIXEL_SIZE,
  animationFrameLimit: 6,
  PLAYER_LAYER: '######players######',
  OFFSET: { x: -11, y: -6 },
  GAME_CONFIG: {
    width: 352,
    height: 198,
    scale: 3
  },
  textures: {
    hero: {
      img: 'public/textures/characters/hero.png',
      config: 'public/textures/characters/hero.json'
    },
    'old-man': {
      img: 'public/textures/characters/old-man.png',
      config: 'public/textures/characters/old-man.json'
    },
    marker: { config: 'public/textures/utils/marker.json' }
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
          type: 'Player',
          isPlayerControlled: true,
          x: 6 * PIXEL_SIZE,
          y: 24 * PIXEL_SIZE,
          index: 5
        },
        'old-man': {
          type: 'NPC',
          texture: 'old-man',
          x: 21 * PIXEL_SIZE,
          y: 6 * PIXEL_SIZE,
          behaviorLoop: [],
          index: 5
        }
      },
      markerObjects: {
        homeMarker: {
          type: 'Marker',
          x: 6 * PIXEL_SIZE,
          y: 23 * PIXEL_SIZE
        },
        largehouseMarker: {
          type: 'Marker',
          x: 12 * PIXEL_SIZE,
          y: 9 * PIXEL_SIZE
        },
        townhallMarker: {
          type: 'Marker',
          x: 20 * PIXEL_SIZE,
          y: 6 * PIXEL_SIZE
        },
        smallMarker: {
          type: 'Marker',
          x: 25 * PIXEL_SIZE,
          y: 18 * PIXEL_SIZE
        },
        bridgeMarker: {
          type: 'Marker',
          x: 33 * PIXEL_SIZE,
          y: 7 * PIXEL_SIZE
        }
      }
    }
  }
};
