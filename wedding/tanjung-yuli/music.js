(() => {
  const audio = document.getElementById('background-music');
  const control = document.getElementById('music-control');
  const openButton = document.getElementById('open-invitation');
  if (!audio || !control || !openButton) return;

  audio.volume = 0.65;

  function updateControl() {
    const playing = !audio.paused && !audio.ended;
    control.classList.toggle('is-playing', playing);
    control.textContent = playing ? '♫' : '♪';
    control.setAttribute('aria-label', playing ? 'Jeda musik' : 'Putar musik');
    control.title = playing ? 'Jeda Kita Satu' : 'Putar Kita Satu';
  }

  function play() {
    const attempt = audio.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(updateControl);
  }

  openButton.addEventListener('click', () => {
    control.hidden = false;
    play();
  });
  if (document.getElementById('invitation').getAttribute('aria-hidden') === 'false') {
    control.hidden = false;
  }
  control.addEventListener('click', () => {
    if (audio.paused) play();
    else audio.pause();
  });
  audio.addEventListener('play', updateControl);
  audio.addEventListener('pause', updateControl);
  audio.addEventListener('ended', updateControl);
  audio.addEventListener('error', () => {
    updateControl();
    control.title = 'Audio tidak dapat dimuat';
  });
  updateControl();
})();
