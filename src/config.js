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
        config: 'public/maps/dorf.json',
        image: 'public/textures/maps/dorf.png',
        tilesetConfig: 'public/textures/maps/dorf.json'
      },
      configObjects: {
        hero: {
          type: 'Character',
          isPlayerControlled: true,
          x: 15 * PIXEL_SIZE,
          y: 19 * PIXEL_SIZE,
          index: 5
        }
      }
    }
  }
};
