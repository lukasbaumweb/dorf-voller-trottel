window.externalScriptRunner.register('find-errors', (root) => {
  const script = document.createElement('script');
  script.onload = function () {
    const html = `
    <div id="login-page-container" class="login-page">
        <div id="login-page-inner">
            <div id="user-image-container">
                <i class="fa fa-user-o fa-5x"></i>
            </div>
            <div id="username-container">
                <h2>Administrator</h2>
            </div>
            <div id="input-container">
                <input type="password" id="password" placeholder="Passwort eingeben">
                <button id="submit"><i class="fa fa-arrow-right"></i></button>
            </div>
            <span id="hint">Passworthinweis: Fängt mit P an und ist mega knuffig😍</span>
        </div>
    </div>`;

    root.innerHTML = html;
    const CryptoJS = window.CryptoJS || {};
    const crypt = {
      secret: 'CIPHERKEY must be secret',
      correctPassword: 'U2FsdGVkX1/pzixTrn1fJEITpnaF7tbPH+Q2o+PaL7c=',

      encrypt: (clear) => {
        const cipher = CryptoJS.AES.encrypt(clear, crypt.secret);
        return cipher.toString();
      },

      decrypt: (cipher) => {
        const decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
        return decipher.toString(CryptoJS.enc.Utf8);
      }
    };

    function submitPassword() {
      const password = document.getElementById('password').value;
      const ciphertext = crypt.encrypt(password);

      return crypt.decrypt(ciphertext) === crypt.decrypt(crypt.correctPassword);
    }

    const checkPassword = () => {
      if (submitPassword()) {
        document.getElementById('password').setCustomValidity('');
        const key = 'playerStoryProgress';
        const raw = window.localStorage.getItem(key);
        let storyFlags = {};
        if (raw !== null && raw !== 'null') {
          storyFlags = JSON.parse(raw || {});
        }
        storyFlags['help-erna'] = true;
        window.localStorage.setItem(key, JSON.stringify(storyFlags));
        document.getElementById('password').parentElement.innerHTML = '<h3>Herzlich Willkommen ...<h3>';
        const evt1 = new window.CustomEvent('renderQuests');
        const evt2 = new window.CustomEvent('addStoryFlag', { detail: { flag: 'helped-erna' } });

        document.dispatchEvent(evt1);
        document.dispatchEvent(evt2);
      } else {
        document.getElementById('password').setCustomValidity('Falsches Passwort!');
        document.getElementById('password').setAttribute('placeholder', 'Falsches Passwort');
        document.getElementById('password').value = '';
      }
    };

    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        checkPassword();
      }
    });

    const submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', checkPassword);

    passwordInput.addEventListener('input', () => {
      document.getElementById('password').setAttribute('placeholder', 'Passwort eingeben');
      document.getElementById('password').setCustomValidity('');
    });
  };
  script.onerror = (err) => {
    console.error(err);
  };
  script.src = `${window.location.origin}/public/js/crypto-js.min.js`;

  document.head.appendChild(script);
});
