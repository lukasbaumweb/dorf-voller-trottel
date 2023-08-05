window.externalScriptRunner.register('find-errors', (wrapper) => {
  const imagePath = window.location.origin + '/public/images/suchbild.png';

  const initialState = {
    serverroom: {},
    printer: {},
    server: {},
    water: {},
    paperstack: {},
    'usb-stick': {},
    'post-it': {},
    'fish-bowle': {},
    monitor: {},
    food: {}
  };
  const saved = window.localStorage.getItem('search-image-state');
  const targets = saved !== null && saved !== 'null' ? Object.assign(initialState, JSON.parse(saved)) : initialState;
  const center = ({ x1, y1, x2, y2 }) => ({ x: (x1 + x2) * 0.5, y: (y1 + y2) * 0.5 });

  const checkCompletion = () => {
    const allFinsihed = Object.values(targets).every((target) => Boolean(target.found));
    console.debug('Allfinished', allFinsihed);
    if (allFinsihed) {
      const evt = new window.CustomEvent('addStoryFlag', { detail: { flag: 'found-his-home' } });
      document.dispatchEvent(evt);
    }
    window.localStorage.setItem('search-image-state', JSON.stringify(targets));
  };

  const addCross = (target) => {
    const cross = document.createElement('i');
    cross.classList.add('fa');
    cross.classList.add('fa-times');
    cross.classList.add('cross');
    cross.ariaHidden = 'true';
    cross.style.position = 'absolute';

    const coords = target.coords.split(',').map((x) => parseInt(x));

    const mid = center({ x1: coords[0], y1: coords[1], x2: coords[2], y2: coords[3] });

    cross.style.left = `${mid.x}px`;
    cross.style.top = `${mid.y}px`;
    document.getElementById('inner-container').appendChild(cross);
  };

  window.onErrorClicked = (target, error) => {
    targets[error].found = true;
    if (targets[error].found) addCross(target);
    checkCompletion();
  };

  wrapper.innerHTML = `
    <div style="position:relative;width: fit-content;" id="inner-container">
        <img src="${imagePath}" alt="Finde alle Fehler" usemap="#workmap" width="1200px" style="width: 1200px!important">
        <map name="workmap">
            <area shape="rect" coords="513,115,582,134" href="#" onClick="onErrorClicked(this, 'serverroom')" id="area-serverroom"  />
            <area shape="rect" coords="76,306,152,386" href="#"  onClick="onErrorClicked(this, 'printer')" id="area-printer"  />
            <area shape="rect" coords="528,194,633,396" href="#" onClick="onErrorClicked(this, 'server')" id="area-server"  />
            <area shape="rect" coords="467,327,528,424" href="#"  onClick="onErrorClicked(this, 'water')" id="area-water"  />
            <area shape="rect" coords="269,313,415,354" href="#"  onClick="onErrorClicked(this, 'paperstack')" id="area-paperstack"  />
            <area shape="rect" coords="408,477,465,518" href="#"  onClick="onErrorClicked(this, 'usb-stick')" id="area-usb-stick"  />
            <area shape="rect" coords="810,419,859,452" href="#"  onClick="onErrorClicked(this, 'post-it')" id="area-post-it"  />
            <area shape="reac" coords="1017,386,1109,464" href="#"  onClick="onErrorClicked(this, 'fish-bowle')" id="area-fish-bowle"  />
            <area shape="rect" coords="802,293,987,418" href="#"  onClick="onErrorClicked(this, 'monitor')" id="area-monitor"  />
            <area shape="rect" coords="643,431,770,524" href="#" onClick="onErrorClicked(this, 'food')" id="area-food"  />
        </map>
    </div>
  `;

  Object.entries(targets).forEach(([id, values]) => {
    if (values.found) {
      addCross(document.getElementById(`area-${id}`));
    }
  });
});
