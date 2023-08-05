const PIXEL_SIZE = 16;

export const STORY_FLAGS = {
  'read-intro': true,
  'talked-to-mayor-for-first-time': false,
  'found-his-home': false,
  'talked-to-mayor-for-second-time': false,
  'talked-to-grandma-erna-for-first-time': false,
  'helped-erna': false,
  'talked-to-mayor-for-third-time': false
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
      texture: 'public/textures/characters/nerd.png',
      config: 'public/textures/characters/nerd.json'
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
              required: ['read-intro'],
              disqualify: ['talked-to-mayor-for-first-time'],
              events: [
                {
                  type: 'textMessage',
                  text: '„Ohh… Du musst das neue Schaf in meiner Heerde sein (HiHi). Ich bin Fred, der Bürgermeister hier im Ort. Gerne erkläre ich Dir kurz, wie hier alles abläuft…“',
                  faceHero: 'old-man'
                },
                {
                  type: 'textMessage',
                  text: '„Die meisten laufen hier umher, indem Sie die Pfeiltasten benutzen. Um miteinander und mit Gegenständen zu interagieren, kannst du die Entertaste verwenden. Schau dich doch einfach ein wenig um und komm wieder zu mir, wenn du Hilfe brauchst oder eine Aufgabe erhalten willst.“',
                  faceHero: 'old-man'
                },
                { type: 'addStoryFlag', flag: 'talked-to-mayor-for-first-time' }
              ]
            },
            {
              required: ['talked-to-mayor-for-first-time'],
              disqualify: ['talked-to-mayor-for-second-time'],
              events: [
                {
                  type: 'textMessage',
                  text: '„Da bist Du ja schon wieder. Das ging aber schnell. Ich dachte mir Du solltest wohl als erstes dein neues Domizil und Arbeitsstätte aufsuchen und dich ein wenig einrichten. Suche einfach nach dem Haus mit blauen Dach im Südwesten der Insel.“',
                  faceHero: 'old-man'
                },
                { type: 'addStoryFlag', flag: 'talked-to-mayor-for-second-time' }
              ]
            },
            {
              required: ['found-his-home'],
              disqualify: ['talked-to-mayor-for-third-time'],
              events: [
                {
                  type: 'textMessage',
                  text: '„So nun startet der Ernst deiner Karriere bei uns im Ort. Ich habe gehört Erna hat ein Computerproblem. Magst Du dich bitte darum kümmern, ich danke Dir im Voraus hierfür.“',
                  faceHero: 'old-man'
                },
                { type: 'addStoryFlag', flag: 'talked-to-mayor-for-third-time' }
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
      markers: {
        'home-marker': {
          type: 'Marker',
          x: 6 * PIXEL_SIZE,
          y: 23 * PIXEL_SIZE,
          index: 5,
          interactable: true,
          showModalOnClick: true,
          modalContent: 'public/js/find-errors.js',
          required: ['talked-to-mayor-for-second-time'],
          disqualify: ['found-his-home'],
          title: 'Finde alle Fehler im Bild',
          description:
            'Dein Vorgänger, Ralf Reinfall, hat sein Büro wüst hinterlassen. Er nahm es auch nicht so ernst mit der IT-Sicherheit. Finde 10 Fehler im Bild, die IT-Sicherheitslücken darstellen und beweise, dass Du ein echter Security-Sherlock bist! Los geht’s! Viel Erfolg beim Suchen!'
        }
      },
      portals: {
        home: {},
        'large house': {},
        townhall: {},
        'small house': {
          transitionToMap: 'small house',
          required: ['talked-to-mayor-for-third-time']
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
        },
        'grandma-erna': {
          type: 'NPC',
          x: 15 * PIXEL_SIZE,
          y: 15 * PIXEL_SIZE,
          index: 5,
          texture: 'public/textures/characters/grandma-erna.png',
          config: 'public/textures/characters/grandma-erna.json',
          talking: [
            {
              required: ['talked-to-mayor-for-second-time'],
              disqualify: ['talked-to-grandma-erna-for-first-time'],
              events: [
                {
                  type: 'textMessage',
                  text: '„Oh, hallo junger Mann! Du musst <NAME>, der neue IT-Sicherheitsexperte sein. Wie schön, dass Du endlich da bist. Dein Vorgänger, Ralf Reinfall, konnte mir leider nicht helfen. Der war aber auch eine Katastrophe auf zwei Beinen, sag ich dir! Und Hunde mochte er auch nicht. Wie kann man nur keine Hunde mögen?!!!1!?? Aber komm doch erstmal rein.“',
                  faceHero: 'grandma-erna'
                },
                { type: 'addStoryFlag', flag: 'talked-to-grandma-erna-for-first-time' },
                {
                  type: 'textMessage',
                  text: 'Helfe der alten Dame ihr Passwort zu finden. Im Haus findest Du 4 Hinweise, die auf das richtige Passwort schließen lassen. Wenn Du alle Hinweise gefunden hast, gib das Passwort am Computer der alten Dame ein. Ob Du wirklich richtig liegst, siehst Du, wenn der Bildschirm angeht. Viel Erfolg!'
                }
              ]
            }
          ],
          behaviorLoop: [
            { type: 'stand', direction: 'down', time: 3000 },
            { type: 'walk', direction: 'down' },
            { type: 'stand', direction: 'down', time: 5000 },
            { type: 'walk', direction: 'right' },
            { type: 'walk', direction: 'right' },
            { type: 'walk', direction: 'right' },
            { type: 'walk', direction: 'right' },
            { type: 'walk', direction: 'right' },
            { type: 'walk', direction: 'right' },
            { type: 'walk', direction: 'right' },
            { type: 'walk', direction: 'right' },
            { type: 'walk', direction: 'right' },
            { type: 'walk', direction: 'right' },
            { type: 'stand', direction: 'up', time: 6000 },
            { type: 'walk', direction: 'up' },
            { type: 'walk', direction: 'left' },
            { type: 'walk', direction: 'left' },
            { type: 'walk', direction: 'left' },
            { type: 'walk', direction: 'left' },
            { type: 'walk', direction: 'left' },
            { type: 'walk', direction: 'left' },
            { type: 'walk', direction: 'left' },
            { type: 'walk', direction: 'left' },
            { type: 'walk', direction: 'left' },
            { type: 'walk', direction: 'left' }
          ]
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
          type: 'Marker',
          showTooltip: false,
          showModalOnClick: true,
          modalContent: 'public/images/calendar.png',
          title: 'Hinweis: Ein Geburtstag scheint sehr wichtig zu sein'
        },
        'dog-marker': {
          type: 'Marker',
          showTooltip: false,
          showModalOnClick: true,
          modalContent: 'public/images/dog.png',
          title: 'Der Hund des Hauses'
        },
        'computer-marker': {
          type: 'Marker',
          showTooltip: false,
          showModalOnClick: true,
          modalContent: 'public/js/windows-login.js',
          title: 'Finde das Passwort heraus! Im Haus sind scheinbar Hinweise versteckt'
        },
        'dog bed-marker': {
          type: 'Marker',
          showTooltip: false,
          showModalOnClick: true,
          modalContent: 'public/images/dog bed.png',
          title: 'Hinweis: Hmmm 🤔 Ein Bett für ein Haustier scheint das zu sein'
        },
        'sniffing blanket-marker': {
          type: 'Marker',
          showTooltip: false,
          showModalOnClick: true,
          modalContent: 'public/images/sniffing blanket.png',
          title: 'Hinweis: Die personalisierte Decke wird regelmäßig gereinigt'
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
      id: 'talked-to-mayor-for-first-time',
      short: 'Rede mit dem Bürgermeister am Brunnen!',
      long: 'Der Bürgermeister gibt dir aktuell die Aufträge, da die Bürger dich noch nicht kennen.'
    },
    {
      id: 'talked-to-mayor-for-second-time',
      short: 'Schaue dich um und rede anschlißend mit dem Bürgermeister am Brunnen, um einen Auftrag zu bekommen!',
      long: 'Der Bürgermeister gibt dir aktuell die Aufträge, da die Bürger dich noch nicht kennen.'
    },
    {
      id: 'found-his-home',
      short: 'Finde dein Büro!',
      long: 'Suche einfach nach dem Haus mit blauen Dach im Südwesten der Insel',
      award: 'public/images/quest-auszeichnung-cybersherlock.png',
      awardTitle: 'Auszeichnung: Cyber Sherlock'
    },
    {
      id: 'talked-to-mayor-for-third-time',
      short: 'Rede mit dem Bürgermeister am Brunnen!',
      long: 'Der Bürgermeister gibt dir aktuell die Aufträge, da die Bürger dich noch nicht kennen.'
    },
    {
      id: 'helped-erna',
      short: 'Betrete das Haus der alten Dame (Erna) und finde ihr Passwort heraus',
      long: 'Ernas Haus hat ein orangenes Dach im Osten der Insel in der Nähe des Brunnes und mit einem Zaun um den Garten',
      award: 'public/images/quest-auszeichnung-paul.png',
      awardTitle: 'Auszeichnung: Passwort Hacker'
    }
  ]
};
