const PIXEL_SIZE = 16;

export const CONFIG = {
  PIXEL_SIZE,
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
        lowerImagePath: 'public/maps/dorf/dorf.png',
        upperImagePath: 'public/maps/dorf/dorf-upper.png'
      },
      configObjects: {
        hero: {
          type: 'Player',
          isPlayerControlled: true,
          x: 31 * PIXEL_SIZE,
          y: 7 * PIXEL_SIZE,
          index: 5
        },
        'old-man': {
          type: 'NPC',
          texture: 'old-man',
          x: 23 * PIXEL_SIZE,
          y: 11 * PIXEL_SIZE,
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
          y: 18 * PIXEL_SIZE,
          transitionToMap: 'old-lady-home'
        }
        // bridgeMarker: {
        //   type: 'Marker',
        //   x: 36 * PIXEL_SIZE,
        //   y: 7 * PIXEL_SIZE
        // }
      }
    },
    'old-lady-home': {
      id: 'old-lady-home',
      width: 30,
      height: 20,
      map: {
        config: 'public/maps/haus-alte-dame/haus-alte-dame.json',
        lowerImagePath: 'public/maps/haus-alte-dame/haus-alte-dame.png',
        upperImagePath: 'public/maps/haus-alte-dame/haus-alte-dame-upper.png'
      },
      configObjects: {
        hero: {
          type: 'Player',
          isPlayerControlled: true,
          x: 15 * PIXEL_SIZE,
          y: 18 * PIXEL_SIZE,
          index: 5
        }
      }
    }
  },
  quests: [
    {
      name: 'Erste Quest',
      description: 'Rede mit dem Bürgermeister!',
      // TODO: Vielleicht Kompass einbauen, der in die Richtung zeigt
      hint: 'show image',
      image: ''
    },
    {
      name: 'Zweite Quest',
      description: 'Finde dein Büro!',
      // TODO: Vielleicht Kompass einbauen, der in die Richtung zeigt
      hint: 'show image',
      image: ''
    }
  ]
};
