// js/video-player.js

// No import needed as we're using the global videojs object.

videojs.registerPlugin("examplePlugin", function (options) {
  

  this.on("play", () => {
    videojs.log("The video is playing!")
  })

  this.on("ended", () => {
    videojs.log("The video has ended!")
  })

  // Example of adding a control
  var myButton = videojs.extend(videojs.getComponent("Button"), {
    constructor: function () {
      videojs.getComponent("Button").apply(this, arguments)
      this.addClass("vjs-my-custom-button")
      this.controlText("My Custom Button")
    },
    handleClick: () => {
      videojs.log("My custom button was clicked!")
    },
  })

  videojs.registerComponent("MyButton", myButton)
  this.controlBar.addChild("MyButton", {})

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
