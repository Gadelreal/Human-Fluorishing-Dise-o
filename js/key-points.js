document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar todos los elementos key-point
  const keyPoints = document.querySelectorAll(".key-point")

  // Añadir efecto de aparición escalonada
  keyPoints.forEach((keyPoint, index) => {
    // Retrasar la animación para cada key-point
    keyPoint.style.animationDelay = `${index * 0.15}s`

    // Añadir interacción al hacer clic
    keyPoint.addEventListener("click", () => {
      // Añadir clase para destacar temporalmente
      keyPoint.classList.add("key-point-highlight")

      // Eliminar la clase después de la animación
      setTimeout(() => {
        keyPoint.classList.remove("key-point-highlight")
      }, 500)
    })

    // Asegurar que los key-points sean accesibles
    if (!keyPoint.getAttribute("role")) {
      keyPoint.setAttribute("role", "note")
    }

    // Añadir soporte para teclado
    keyPoint.setAttribute("tabindex", "0")

    keyPoint.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        // Añadir clase para destacar temporalmente
        keyPoint.classList.add("key-point-highlight")

        // Eliminar la clase después de la animación
        setTimeout(() => {
          keyPoint.classList.remove("key-point-highlight")
        }, 500)
      }
    })

    // Asegurar que el título sea descriptivo
    const keyPointTitle = keyPoint.querySelector("h3")
    if (keyPointTitle && !keyPoint.getAttribute("aria-label")) {
      const keyPointContent = keyPoint.querySelector("p")
      if (keyPointContent) {
        const shortContent = keyPointContent.textContent.substring(0, 50) + "..."
        keyPoint.setAttribute("aria-label", `Key point: ${shortContent}`)
      }
    }
  })
})
