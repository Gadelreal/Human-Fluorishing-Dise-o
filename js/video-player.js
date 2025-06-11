import videojs from "video.js"

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar todos los reproductores VideoJS en la página
  const videoElements = document.querySelectorAll(".video-js")

  videoElements.forEach((videoElement) => {
    if (!videoElement.id) {
      console.error("Video element missing ID attribute", videoElement)
      return
    }

    const player = videojs(videoElement.id, {
      fluid: true,
      responsive: true,
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      controlBar: {
        children: [
          "playToggle",
          "volumePanel",
          "currentTimeDisplay",
          "timeDivider",
          "durationDisplay",
          "progressControl",
          "playbackRateMenuButton",
          "fullscreenToggle",
        ],
      },
      // Añadir opciones de accesibilidad
      userActions: {
        hotkeys: true,
      },
    })

    // Añadir logo de IE en la esquina superior derecha
    player.ready(() => {
      try {
        const logoOverlay = player.addChild("component")
        logoOverlay.el().classList.add("vjs-logo-overlay")
        logoOverlay.el().setAttribute("aria-hidden", "true") // Ocultar para lectores de pantalla

        const logoImage = document.createElement("img")
        // Usar la ruta correcta al logo pequeño
        const logoPath =
          videoElement.getAttribute("data-logo") ||
          (window.location.pathname.includes("/es/")
            ? "../assets/images/logo-ie-small.svg"
            : "assets/images/logo-ie-small.svg")

        logoImage.src = logoPath
        logoImage.alt = "IE University"
        logoImage.classList.add("vjs-logo")
        logoImage.width = 60 // Asegurar que el tamaño sea adecuado

        // Añadir manejo de errores para la carga del logo
        logoImage.onerror = () => {
          console.error("Error loading logo:", logoPath)
        }

        logoImage.onload = () => {
          console.log("Logo loaded successfully:", logoPath)
        }

        logoOverlay.el().appendChild(logoImage)
      } catch (error) {
        console.error("Error adding logo to video player:", error)
      }
    })

    // Evento para registrar progreso de visualización
    player.on("timeupdate", () => {
      const currentTime = player.currentTime()
      const duration = player.duration()
      const percentWatched = (currentTime / duration) * 100

      // Si el usuario ha visto más del 90% del video, considerarlo como completado
      if (percentWatched > 90) {
        const videoId = videoElement.getAttribute("data-video-id")
        if (videoId) {
          // Guardar en localStorage que el usuario ha visto este video
          localStorage.setItem(`video_${videoId}_watched`, "true")

          // Actualizar la interfaz si es necesario
          const checkmark = document.querySelector(`.video-checkmark[data-video-id="${videoId}"]`)
          if (checkmark) {
            checkmark.classList.add("watched")
          }
        }
      }
    })

    // Añadir soporte para teclas de accesibilidad
    player.on("keydown", (event) => {
      // Tecla M para silenciar/activar sonido
      if (event.key === "m" || event.key === "M") {
        if (player.muted()) {
          player.muted(false)
        } else {
          player.muted(true)
        }
      }

      // Teclas de flecha izquierda/derecha para retroceder/avanzar 5 segundos
      if (event.key === "ArrowLeft") {
        player.currentTime(Math.max(0, player.currentTime() - 5))
      }
      if (event.key === "ArrowRight") {
        player.currentTime(Math.min(player.duration(), player.currentTime() + 5))
      }

      // Teclas de flecha arriba/abajo para subir/bajar volumen
      if (event.key === "ArrowUp") {
        player.volume(Math.min(1, player.volume() + 0.1))
      }
      if (event.key === "ArrowDown") {
        player.volume(Math.max(0, player.volume() - 0.1))
      }
    })

    // Añadir anuncio de accesibilidad
    const accessibilityInfo = document.createElement("div")
    accessibilityInfo.className = "vjs-accessibility-info"
    accessibilityInfo.innerHTML = `
      <p class="sr-only">Controles de teclado disponibles: 
        Espacio para reproducir/pausar, 
        M para silenciar, 
        Flechas izquierda/derecha para retroceder/avanzar 5 segundos, 
        Flechas arriba/abajo para subir/bajar volumen
      </p>
    `
    player.el().appendChild(accessibilityInfo)
  })
})

// Funcionalidad para los posters de video
document.addEventListener("DOMContentLoaded", () => {
  const videoPosterElements = document.querySelectorAll(".video-poster")

  videoPosterElements.forEach((poster) => {
    poster.addEventListener("click", function () {
      // Aquí se podría implementar la lógica para reproducir el video
      // Por ahora, solo mostramos un mensaje en la consola
      const videoTitle = this.getAttribute("alt")
      console.log(`Reproduciendo video: ${videoTitle}`)

      // Animación simple al hacer clic
      this.style.opacity = "0.7"
      setTimeout(() => {
        this.style.opacity = "1"
      }, 300)
    })

    // Asegurar que los posters de video sean accesibles por teclado
    if (!poster.getAttribute("tabindex")) {
      poster.setAttribute("tabindex", "0")
      poster.setAttribute("role", "button")
      poster.setAttribute("aria-label", `Play video: ${poster.getAttribute("alt")}`)

      poster.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          this.click()
        }
      })
    }
  })
})
