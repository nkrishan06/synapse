// Author: Krishan Navas. Keep native video controls and keyboard behavior.
const films = [...document.querySelectorAll('video')];
document.addEventListener('play', (event) => {
  if (!(event.target instanceof HTMLVideoElement)) return;
  films.forEach((film) => { if (film !== event.target) film.pause(); });
}, true);

films.forEach((film) => {
  const showError = () => {
    const frame = film.closest('figure');
    if (frame.querySelector('.media-error')) return;
    const message = document.createElement('p');
    message.className = 'media-error';
    message.setAttribute('role', 'status');
    message.append('La vidéo ne peut pas être chargée. ');
    const link = document.createElement('a');
    link.href = film.querySelector('source').getAttribute('src');
    link.textContent = 'Ouvrir la vidéo directement';
    message.append(link);
    frame.insertAdjacentElement('afterend', message);
  };
  film.addEventListener('error', showError);
  film.querySelector('source').addEventListener('error', showError);
});
