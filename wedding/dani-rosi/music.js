(() => {
  const audio = document.getElementById('background-music');
  const button = document.getElementById('music-control');
  const cover = document.getElementById('cover');
  const openButton = document.getElementById('open-invitation');
  if (!audio || !button || !openButton) return;

  audio.volume = 0.65;

  const update = () => {
    const playing = !audio.paused && !audio.ended;
    button.classList.toggle('is-playing', playing);
    button.textContent = playing ? '♫' : '♪';
    button.setAttribute('aria-label', playing ? 'Jeda musik' : 'Putar musik');
    button.title = playing ? 'Jeda Pinillit Ni Tondi' : 'Putar Pinillit Ni Tondi';
  };

  const play = () => {
    const attempt = audio.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(update);
  };

  openButton.addEventListener('click', () => {
    button.hidden = false;
    play();
  });
  if (cover && cover.classList.contains('opened')) button.hidden = false;

  button.addEventListener('click', () => {
    if (audio.paused) play();
    else audio.pause();
  });
  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);
  audio.addEventListener('ended', update);
  audio.addEventListener('error', () => {
    button.hidden = false;
    button.title = 'Audio tidak dapat dimuat';
    update();
  });
  update();
})();
