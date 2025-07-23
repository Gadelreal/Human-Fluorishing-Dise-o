// js/video-player.js

// Declare the videojs variable as a global object
const videojs = window.videojs

// Array to store all video player instances
const allVideoPlayers = []

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
      videojs(el, {
        plugins: {
          examplePlugin: {},
        },
      })
      el.classList.add("vjs-initialized")
    }
  })
})
