const PIXEL_SIZE = 16;

export const CONFIG = {
  PIXEL_SIZE: PIXEL_SIZE,
  animationFrameLimit: 6,
  PLAYER_LAYER: '######players######',
  OFFSET: { x: -10, y: -6 },
  textures: {
    hero: {
      img: 'public/textures/characters/hero.png',
      config: 'public/textures/characters/hero.json'
    }
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
      }
    }
  }
};
