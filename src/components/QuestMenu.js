import { CONFIG } from '../config';
import { getPlayerState } from '../gameState';

const visibleIcon = '<i class="fa fa-chevron-left" aria-hidden="true"></i>';
const inVisibleIcon = '<i class="fa fa-chevron-right" aria-hidden="true"></i>';

export class QuestMenu {
  constructor() {
    this.visible = false;
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.wrapper.remove();
    this.onComplete();
  }

  init() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('quest-menu');

    this.btn = document.createElement('button');
    this.btn.id = 'toggleVisibility';
    this.btn.innerHTML = visibleIcon;

    this.header = document.createElement('div');
    this.header.classList.add('quest-header');
    this.header.appendChild(this.btn);
    this.header.innerHTML += '<h2 title="Hier kannst du deinen Fortschritt verfolgen">Quests</h2>';

    this.wrapper.appendChild(this.header);

    this.content = document.createElement('div');
    this.content.classList.add('quest-content');

    this.wrapper.appendChild(this.content);

    document.body.appendChild(this.wrapper);

    document.getElementById('toggleVisibility').addEventListener('click', () => this.toggle());

    document.addEventListener('renderQuests', () => {
      console.log(this.renderQuests);
      this.renderQuests();
    });

    this.renderQuests();
  }

  renderQuests() {
    this.progress = getPlayerState();
    this.completeProgress = CONFIG.quests;
    this.content.innerHTML = '';
    this.completeProgress.forEach((quest, index) => {
      const el = document.createElement('div');
      el.setAttribute('data-quest-key', quest.id);

      const isFinished = Boolean(this.progress[quest.id]);
      const prevQuestFinsished = index > 0 ? Boolean(this.progress[this.completeProgress[index - 1].id]) : true;

      const isCurrent = Boolean(prevQuestFinsished && !isFinished);

      if (isCurrent) {
        el.classList.add('current');
      } else {
        el.classList.add(isFinished ? 'finished' : 'unfinished');
      }
      el.innerHTML = `<i class="fa fa-${isFinished ? 'check-' : ''}circle${
        isFinished ? '' : '-o'
      }" aria-hidden="true"></i><p title="${quest.long || 'Keine Beschreibung vorhanden'}">${
        quest.short
      } <i class="fa fa-question-circle-o" aria-hidden="true"></i>
      </p>`;
      this.content.appendChild(el);
    });
  }

  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    document.getElementById('toggleVisibility').innerHTML = inVisibleIcon;
    this.visible = true;
    this.wrapper.classList.add('extended');
  }

  hide() {
    document.getElementById('toggleVisibility').innerHTML = visibleIcon;
    this.visible = false;
    this.wrapper.classList.remove('extended');
  }
}
