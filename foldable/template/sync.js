function initSync(slideshow) {
  const relayServer = 'https://demo.httprelay.io/link/';
  let main = false;
  let linkId = null;
  let send = false;

  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'l':
        linkId = 'bs_' + Math.random().toString(36).substring(2);
        const msg = 'Your link ID is: ' + linkId;
        console.log(msg);
        alert(msg);
        startSync(true);
        break;
      case 'k':
        linkId = window.prompt('Enter the link ID');
        if (!linkId) return;
        console.log('You\'re linked to ID: ' + linkId);
        startSync(false);
        break;
      case 'ArrowLeft':
        if (send) sendMessage({ cmd: 'go', val: currSlide() - 1 });
        break;
      case 'ArrowRight':
        if (send) sendMessage({ cmd: 'go', val: currSlide() + 1 });
        break;
    }
  });

  function startSync(isMain) {
    if (isMain) {
      main = true;
    }
    send = true;
    getMessage();
    if (isMain) {
      sendMessage({ cmd: 'go', val: currSlide() });
    }
  }

  function currSlide() {
    return slideshow.getCurrentSlideIndex() + 1;
  }

  function getMessage() {
    fetch(relayServer + linkId + (main ? '_sub' : ''))
      .then(response => response.json())
      .then(data => {
        if (data.cmd) {
          switch (data.cmd) {
            case 'go':
              const num = Number(data.val);
              console.log('Go to slide ' + (num));
              if (num !== currSlide()) {
                slideshow.gotoSlide(num);
              }
              break;
          }
        }
      })
      .catch(error => console.error(error))
      .finally(() => getMessage(slideshow));
  }
  
  function sendMessage(data) {
    fetch(relayServer + linkId + (main ? '' : '_sub'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}
