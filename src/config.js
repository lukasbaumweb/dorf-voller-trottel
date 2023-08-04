const PIXEL_SIZE = 16;

export const STORY_FLAGS = {
  'read-intro': true,
  'talk-to-mayor': false,
  'find-your-home': false,
  'talk-to-mayor-2': false,
  'help-erna': false
};

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
  maps: {
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
        }
      },
      items: {
        'search-image': {
          type: 'Item',
          x: 6 * PIXEL_SIZE,
          y: 23 * PIXEL_SIZE,
          index: 5,
          texture: 'public/images/suchbild.png',
          interactable: true,
          showModalOnClick: true,
          modalContent: 'public/images/suchbild.png',
          required: ['talked-to-mayor']
        }
      },
      portals: {
        home: {},
        'large house': {},
        townhall: {},
        'small house': {
          transitionToMap: 'small house'
        }
      }
    },
    'small house': {
      id: 'small house',
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
        }
      },
      items: {
        calendar: {
          type: 'Item',
          texture: 'public/textures/items/calendar.png',
          interactable: true,
          showModalOnClick: true,
          modalContent: 'public/images/calendar.png',
          title: 'Hinweis: Ein Geburtstag scheint sehr wichtig zu sein'
        },
        dog: {
          type: 'Item',
          texture: 'public/textures/items/dog.png',
          interactable: true,
          showModalOnClick: true,
          modalContent: 'public/images/dog.png',
          title: 'Der Hund des Hauses'
        },
        computer: {
          type: 'Item',
          texture: 'public/textures/items/computer.png',
          interactable: true,
          showModalOnClick: true,
          modalContent: 'public/js/windows-login.js',
          title: 'Finde das Passwort heraus! Im Haus sind scheinbar Hinweise versteckt'
        },
        'dog bed': {
          type: 'Item',
          texture: 'public/textures/items/dog bed.png',
          interactable: true,
          showModalOnClick: true,
          modalContent: 'public/images/dog bed.png',
          width: 2 * PIXEL_SIZE,
          height: PIXEL_SIZE,
          title: 'Hinweis: Hmmm 🤔 Ein Bett für ein Haustier scheint das zu sein'
        },
        'sniffing blanket': {
          type: 'Item',
          texture: 'public/textures/items/sniffing blanket.png',
          interactable: true,
          showModalOnClick: true,
          modalContent: 'public/images/sniffing blanket.png',
          title: 'Hinweis: Die personalisierte Decke wird regelmäßig gereinigt'
        }
      },

      markers: {
        'calendar-marker': {
          type: 'Marker'
        },
        'dog-marker': {
          type: 'Marker'
        },
        'computer-marker': {
          type: 'Marker'
        },
        'dog bed-marker': {
          type: 'Marker'
        },
        'sniffing blanket-marker': {
          type: 'Marker'
        }
      },

      portals: {
        exit: {
          transitionToMap: 'dorf',
          x: 25 * PIXEL_SIZE,
          y: 18 * PIXEL_SIZE,
          direction: 'up',
          text: 'leave building',
          onAcceptText: 'leave'
        }
      }
    }
  },
  // TODO: Vielleicht Kompass einbauen, der in die Richtung zeigt
  quests: [
    {
      id: 'read-intro',
      short: 'Lese das Intro',
      long: 'Pfeiltasten -> Bewegen; Enter-Taste -> Interagieren'
    },
    {
      id: 'talk-to-mayor',
      short: 'Rede mit dem Bürgermeister am Brunnen!',
      long: 'Der Bürgermeister gibt dir aktuell die Aufträge, da die Bürger dich noch nicht kennen.'
    },
    {
      id: 'find-your-home',
      short: 'Finde dein Büro!',
      long: 'Suche einfach nach dem Haus mit blauen Dach im Südwesten der Insel'
    },
    {
      id: 'crack-password-of-erna',
      short: 'Betrete das Haus der alten Dame (Erna) und finde ihr Passwort heraus',
      long: 'Ernas Haus hat ein orangenes Dach im Osten der Insel in der Nähe des Brunnes und mit einem Zaun um den Garten'
    }
  ],
  monologs: {
    'zero-quest': [
      'Ohh… Du musst das neue Schaf in meiner Heerde sein (HiHi). Ich bin Fred, der Bürgermeister hier im Ort. Gerne erkläre ich Dir kurz, wie hier alles abläuft…',
      'Die meisten laufen hier umher, indem Sie die Pfeiltasten benutzen. Um miteinander und mit Gegenständen zu interagieren, kannst du die Entertaste verwenden. Schau dich doch einfach ein wenig um und komm wieder zu mir, wenn du Hilfe brauchst oder eine Aufgabe erhalten willst.'
    ],
    'first-quest': [
      'Da bist Du ja schon wieder. Das ging aber schnell. Ich dachte mir Du solltest wohl als erstes dein neues Domizil und Arbeitsstätte aufsuchen und dich ein wenig einrichten. Suche einfach nach dem Haus mit blauen Dach im Südwesten der Insel'
    ],
    'second-quest': [
      'So nun startet der Ernst deine Karriere bei uns im Ort. Ich habe gehört Erna hat ein Computerproblem. Magst Du dich bitte darum kümmern, ich danke Dir im Voraus hierfür.'
    ]
  }
};
