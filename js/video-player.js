// js/video-player.js

// Declare the videojs variable as a global object
const videojs = window.videojs;
const allVideoPlayers = [];

// Detectar idioma desde <html lang="..."> no lo tnemos en URL
const language = document.documentElement.lang || 'en'; // por defecto inglés
const language_tracks = (language === 'en') ? 'eng' : 'spa';


videojs.registerPlugin("examplePlugin", function (options) {
  // Add this player to the global array
  allVideoPlayers.push(this);

 
  this.on("play", () => {
    // Pause all other videos when this one starts playing
    allVideoPlayers.forEach((otherPlayer) => {
      if (otherPlayer !== this && !otherPlayer.paused()) {
        otherPlayer.pause();
      }
    });
  });

  this.on("ended", () => {
  });

  // Clean up when player is disposed
  this.on("dispose", () => {
    const index = allVideoPlayers.indexOf(this);
    if (index > -1) {
      allVideoPlayers.splice(index, 1);
    }
  });

  // Inicialización cuando el player está listo
  this.ready(() => {
    this.playbackRates([0.75, 1, 1.25, 1.5, 2]);

    // Activar subtítulos después de que los tracks estén cargados
    this.on('loadedmetadata', () => {
      const tracks = this.textTracks();

      if (tracks && tracks.length >= 2) {
        for (let i = 1; i < tracks.length; i++) {
          tracks[i].mode = 'disabled';
        }

        if (language === 'es') {
          if (tracks[2]) {
            tracks[2].mode = 'showing';
          }
        } else {
          if (tracks[1]) {
            tracks[1].mode = 'showing';
          }
        }

        this.trigger('texttrackchange');
      } 
    });

      // Ajustar texto del botón de reproducción según idioma
      const playButton = this.el().querySelector('.vjs-big-play-button');
      const playButtonText = playButton?.querySelector('.vjs-control-text');

      if (playButton && playButtonText) {
        const label = language === 'es' ? 'Reproducir vídeo' : 'Play video';
        playButtonText.textContent = label;
        playButton.setAttribute('title', label);
        playButton.setAttribute('aria-label', label);
      }
  });

  // Opciones personalizadas (si aplican)
  options = videojs.mergeOptions({ myOption: true }, options);
});

// Inicializar todos los videos con la clase .video-js
document.addEventListener("DOMContentLoaded", () => {
  const videoElements = document.querySelectorAll("video.video-js");
  videoElements.forEach((el) => {
    if (!el.classList.contains("vjs-initialized")) {
      videojs(el, {
        plugins: {
          examplePlugin: {},
        },
      });
      el.classList.add("vjs-initialized");
    }
  });
});