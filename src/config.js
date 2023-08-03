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
      texture: 'public/textures/characters/hero.png',
      config: 'public/textures/characters/hero.json'
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
          x: 31 * PIXEL_SIZE,
          y: 7 * PIXEL_SIZE,
          index: 5
        },
        'old-man': {
          type: 'NPC',
          x: 24 * PIXEL_SIZE,
          y: 10 * PIXEL_SIZE,
          index: 5,
          texture: 'public/textures/characters/old-man.png',
          config: 'public/textures/characters/old-man.json',
          talking: [
            {
              events: [
                {
                  type: 'textMessage',
                  text: 'Wie geht Ihnen? Bestimmt gut.😊 Sie sehen ja gesund aus.',
                  faceHero: 'old-man'
                }
              ]
            }
          ],
          behaviorLoop: [
            { type: 'stand', direction: 'down', time: 5000 },
            { type: 'walk', direction: 'down' },
            { type: 'walk', direction: 'down' },
            { type: 'walk', direction: 'down' },
            { type: 'stand', direction: 'down', time: 2000 },
            { type: 'walk', direction: 'left' },
            { type: 'walk', direction: 'left' },
            { type: 'walk', direction: 'left' },
            { type: 'walk', direction: 'left' },
            { type: 'walk', direction: 'left' },
            { type: 'stand', direction: 'left', time: 2000 },
            { type: 'walk', direction: 'up' },
            { type: 'walk', direction: 'up' },
            { type: 'walk', direction: 'up' },
            { type: 'stand', direction: 'right', time: 5000 },
            { type: 'walk', direction: 'right' },
            { type: 'walk', direction: 'right' },
            { type: 'walk', direction: 'right' },
            { type: 'walk', direction: 'right' },
            { type: 'walk', direction: 'right' }
          ]
        },
        calendar: {
          type: 'Item',
          x: 6 * PIXEL_SIZE,
          y: 23 * PIXEL_SIZE,
          index: 5,
          texture: 'public/images/suchbild.png',
          interactable: true,
          showModalOnClick: true,
          modalContent: 'public/images/suchbild.png'
        }
      },
      portals: {
        home: {},
        'large house': {},
        townhall: {},
        'small house': {
          transitionToMap: 'old-lady-home'
        }
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
          x: 15 * PIXEL_SIZE,
          y: 18 * PIXEL_SIZE,
          index: 5
        },
        calendar: {
          type: 'Item',
          x: 16 * PIXEL_SIZE,
          y: 8 * PIXEL_SIZE,
          index: 5,
          texture: 'public/textures/items/calendar.png',
          interactable: true,
          showModalOnClick: true,
          modalContent: 'public/images/calendar.png'
        } //,
        // dog: {
        //   type: 'Item',
        //   x: 15 * PIXEL_SIZE,
        //   y: 18 * PIXEL_SIZE,
        //   index: 5
        // },
        // computer: { type: 'Item', x: 15 * PIXEL_SIZE, y: 18 * PIXEL_SIZE, index: 5 },
        // 'dog-bed': { type: 'Item', x: 15 * PIXEL_SIZE, y: 18 * PIXEL_SIZE, index: 5 }
      },
      portals: {
        exit: {
          transitionToMap: 'dorf',
          x: 25 * PIXEL_SIZE,
          y: 18 * PIXEL_SIZE,
          direction: 'up'
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
