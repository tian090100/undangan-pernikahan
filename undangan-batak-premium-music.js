document.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('background-music');
  const musicButton = document.getElementById('music');

  const updateMusicControl = (isPlaying) => {
    musicButton.classList.toggle('active', isPlaying);
    musicButton.textContent = isPlaying ? '♫' : '♪';
    musicButton.title = isPlaying ? 'Jeda musik' : 'Putar musik';
    musicButton.setAttribute('aria-label', musicButton.title);
  };

  music.addEventListener('play', () => updateMusicControl(true));
  music.addEventListener('pause', () => updateMusicControl(false));

  document.getElementById('open-invitation').addEventListener('click', () => {
    music.play().catch(() => updateMusicControl(false));
  });

  musicButton.addEventListener('click', () => {
    if (music.paused) music.play().catch(() => updateMusicControl(false));
    else music.pause();
  });
});
