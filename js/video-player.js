// js/video-player.js

// Declare the videojs variable as a global object
const videojs = window.videojs

// Array to store all video player instances
const allVideoPlayers = []

// Configuración base para VideoJS
const videoJSConfig = {
  fluid: true,
  responsive: true,
  playbackRates: [0.5, 1, 1.25, 1.5, 2],
  controls: true,
  preload: "metadata",
  html5: {
    hls: {
      enableLowInitialPlaylist: true,
      smoothQualityChange: true,
      overrideNative: true,
    },
  },
}

videojs.registerPlugin("examplePlugin", function (options) {
  // Add this player to the global array
  allVideoPlayers.push(this)

  this.on("play", () => {
    videojs.log("The video is playing!")

    // Pause all other videos when this one starts playing
    allVideoPlayers.forEach((otherPlayer) => {
      if (otherPlayer !== this && !otherPlayer.paused()) {
        otherPlayer.pause()
      }
    })
  })

  this.on("ended", () => {
    videojs.log("The video has ended!")
  })

  // Clean up when player is disposed
  this.on("dispose", () => {
    const index = allVideoPlayers.indexOf(this)
    if (index > -1) {
      allVideoPlayers.splice(index, 1)
    }
  })

  // Example of adding a control
  var MyButton = videojs.extend(videojs.getComponent("Button"), {
    constructor: function () {
      videojs.getComponent("Button").apply(this, arguments)
      this.addClass("vjs-my-custom-button")
      this.controlText("My Custom Button")
    },
    handleClick: () => {
      videojs.log("My custom button was clicked!")
    },
  })

  videojs.registerComponent("MyButton", MyButton)

  this.ready(() => {
    this.controlBar.addChild("MyButton", {})
  })

  // Example of setting options
  options = videojs.mergeOptions(
    {
      myOption: true,
    },
    options,
  )

  if (options.myOption) {
    videojs.log("My option is enabled!")
  }
})

// Inicializar todos los videos con la clase .video-js
document.addEventListener("DOMContentLoaded", () => {
  var videoElements = document.querySelectorAll("video.video-js")
  videoElements.forEach((el) => {
    // Solo inicializar si aún no está inicializado
    if (!el.classList.contains("vjs-initialized")) {
      // Obtener configuración específica del video
      const videoId = el.getAttribute("data-video-id")
      const logoSrc = el.getAttribute("data-logo")

      // Configuración específica para este video
      const config = Object.assign({}, videoJSConfig)

      // Añadir logo si está disponible
      if (logoSrc) {
        config.logo = {
          image: logoSrc,
          url: "https://www.ie.edu",
          position: "top-right",
        }
      }

      // Inicializar el reproductor
      const player = videojs(el, config)

      // Añadir el reproductor al array
      allVideoPlayers.push(player)

      // Función para pausar todos los otros videos
      function pauseOtherVideos(currentPlayer) {
        allVideoPlayers.forEach((otherPlayer) => {
          if (otherPlayer !== currentPlayer && !otherPlayer.paused()) {
            otherPlayer.pause()
          }
        })
      }

      // Evento cuando el video comienza a reproducirse
      player.on("play", () => {
        pauseOtherVideos(player)
      })

      // Limpiar el array cuando el reproductor se destruye
      player.on("dispose", () => {
        const index = allVideoPlayers.indexOf(player)
        if (index > -1) {
          allVideoPlayers.splice(index, 1)
        }
      })

      // Manejar errores
      player.on("error", () => {
        console.error("Error en el reproductor de video:", player.error())
      })

      // Configurar el reproductor cuando esté listo
      player.ready(() => {
        console.log("Reproductor listo:", videoId)
      })

      el.classList.add("vjs-initialized")
    }
  })
})
