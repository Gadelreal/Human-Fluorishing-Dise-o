document.addEventListener("DOMContentLoaded", () => {
  // Cargar reflexiones guardadas previamente
  loadSavedReflections()

  // Añadir event listeners a todos los botones de guardar
  const saveButtons = document.querySelectorAll(".save-button")
  saveButtons.forEach((button) => {
    button.addEventListener("click", saveReflection)

    // Añadir soporte para teclado
    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        saveReflection(e)
      }
    })
  })

  // Añadir event listeners para los textareas
  const textareas = document.querySelectorAll(".reflection-textarea")
  textareas.forEach((textarea) => {
    // Añadir atributos de accesibilidad
    if (!textarea.getAttribute("aria-required")) {
      textarea.setAttribute("aria-required", "false")
    }

    // Añadir evento para guardar con Ctrl+Enter
    textarea.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault()
        const reflectionId = textarea.id
        const saveButton = document.querySelector(`[data-reflection-id="${reflectionId}"]`)
        if (saveButton) {
          saveButton.click()
        }
      }
    })
  })
})

/**
 * Carga las reflexiones guardadas previamente del localStorage
 */
function loadSavedReflections() {
  // Buscar todos los textareas de reflexión
  const textareas = document.querySelectorAll(".reflection-textarea")

  // Para cada textarea, cargar el contenido guardado si existe
  textareas.forEach((textarea) => {
    const reflectionId = textarea.id
    const savedReflection = localStorage.getItem(`reflection_${reflectionId}`)

    if (savedReflection) {
      textarea.value = savedReflection

      // Añadir indicador visual de contenido guardado
      const feedbackElement = document.getElementById(`feedback-${reflectionId}`)
      if (feedbackElement) {
        feedbackElement.textContent = "Previously saved reflection loaded"
        feedbackElement.classList.add("show")

        // Eliminar la clase después de la animación
        setTimeout(() => {
          feedbackElement.classList.remove("show")
        }, 3000)
      }
    }
  })
}

/**
 * Guarda la reflexión en localStorage y muestra feedback
 */
function saveReflection(event) {
  // Obtener el ID de la reflexión desde el atributo data
  const reflectionId = event.target.getAttribute("data-reflection-id")
  const textarea = document.getElementById(reflectionId)

  // Obtener el valor del textarea
  const reflectionText = textarea.value

  // Validar que haya contenido
  if (!reflectionText.trim()) {
    const feedbackElement = document.getElementById(`feedback-${reflectionId}`)
    feedbackElement.textContent = "Please enter some text before saving"
    feedbackElement.classList.add("show")
    feedbackElement.style.color = "#d32f2f" // Color de error

    // Eliminar la clase después de la animación
    setTimeout(() => {
      feedbackElement.classList.remove("show")
    }, 3000)

    // Enfocar el textarea
    textarea.focus()
    return
  }

  // Guardar en localStorage
  localStorage.setItem(`reflection_${reflectionId}`, reflectionText)

  // Mostrar feedback al usuario
  const feedbackElement = document.getElementById(`feedback-${reflectionId}`)
  feedbackElement.textContent = "Reflection saved successfully!"
  feedbackElement.classList.add("show")
  feedbackElement.style.color = "" // Restablecer al color predeterminado

  // Eliminar la clase después de la animación
  setTimeout(() => {
    feedbackElement.classList.remove("show")
  }, 3000)

  // Anunciar para lectores de pantalla
  const ariaLiveRegion = document.createElement("div")
  ariaLiveRegion.setAttribute("aria-live", "polite")
  ariaLiveRegion.className = "sr-only"
  ariaLiveRegion.textContent = "Your reflection has been saved successfully."
  document.body.appendChild(ariaLiveRegion)

  // Eliminar después de que se haya anunciado
  setTimeout(() => {
    document.body.removeChild(ariaLiveRegion)
  }, 3000)
}
