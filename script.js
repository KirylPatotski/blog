document.addEventListener('DOMContentLoaded', function() {
  function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.offsetHeight;
    const scrollPosition =
      window.scrollY ||
      window.pageYOffset ||
      (document.body.scrollTop +
        (document.documentElement && document.documentElement.scrollTop || 0));
    const progress = (scrollPosition / (fullHeight - windowHeight)) * 100;
    document.getElementById('progress-bar-progress').style.width = progress + '%';
  }

  function scrollToPosition(position) {
    const scrollPercentage = position; // Adjust the value (10) to leave some room at the bottom
    const scrollPosition = (scrollPercentage / 100) * (document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
  }

  window.addEventListener('scroll', updateProgressBar);

  document.getElementById('progress-bar').addEventListener('click', function(event) {
    const progressBar = document.getElementById('progress-bar');
    const progressBarWidth = progressBar.offsetWidth;
    const clickPosition = event.clientX - progressBar.getBoundingClientRect().left;
    const scrollPosition = (clickPosition / progressBarWidth) * 100;
    scrollToPosition(scrollPosition);
  });
});


document.addEventListener('DOMContentLoaded', (event) => {
  const fullscreenButton = document.getElementById('fullscreenButton');

  fullscreenButton.addEventListener('click', () => {
      if (!document.fullscreenElement) {
          if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) { // Firefox
              document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
              document.documentElement.webkitRequestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
              document.documentElement.msRequestFullscreen();
          }
      } else {
          if (document.exitFullscreen) {
              document.exitFullscreen();
          } else if (document.mozCancelFullScreen) { // Firefox
              document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
              document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { // IE/Edge
              document.msExitFullscreen();
          }
      }
  });
});
