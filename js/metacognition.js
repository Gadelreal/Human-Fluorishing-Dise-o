document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const checkboxes = document.querySelectorAll(".metacognition-checkbox")
  const saveButton = document.getElementById("save-metacognition")
  const validationMessage = document.getElementById("metacognition-validation")
  const feedbackElement = document.getElementById("feedback-metacognition")

  // Cargar selecciones guardadas
  loadSavedSelections()

  // Añadir event listeners a los checkboxes
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateCheckboxStyles()
    })

    // Asegurar que los checkboxes sean accesibles
    const checkboxId = checkbox.id
    const label = document.querySelector(`label[for="${checkboxId}"]`)

    if (label) {
      // Asegurar que el texto del label sea descriptivo
      if (!label.textContent.trim()) {
        console.warn(`Empty label text for checkbox ${checkboxId}`)
      }
    } else {
      console.warn(`No label found for checkbox ${checkboxId}`)
    }
  })

  // Event listener para el botón de guardar
  if (saveButton) {
    saveButton.addEventListener("click", saveSelections)

    // Añadir soporte para teclado
    saveButton.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        saveSelections()
      }
    })
  }

  /**
   * Actualiza los estilos de los checkboxes basados en su estado
   */
  function updateCheckboxStyles() {
    checkboxes.forEach((checkbox) => {
      const container = checkbox.closest(".checkbox-container")
      if (checkbox.checked) {
        container.classList.add("selected")
        container.setAttribute("aria-selected", "true")
      } else {
        container.classList.remove("selected")
        container.setAttribute("aria-selected", "false")
      }
    })
  }

  /**
   * Guarda las selecciones en localStorage
   */
  function saveSelections() {
    // Contar cuántos checkboxes están seleccionados
    const selectedCount = Array.from(checkboxes).filter((checkbox) => checkbox.checked).length

    // Validar que al menos 2 estén seleccionados
    if (selectedCount < 2) {
      validationMessage.classList.add("show")
      validationMessage.setAttribute("aria-live", "assertive")

      // Quitar la clase después de la animación
      setTimeout(() => {
        validationMessage.classList.remove("show")
      }, 3000)

      return
    }

    // Guardar selecciones en localStorage
    checkboxes.forEach((checkbox) => {
      localStorage.setItem(`metacognition_${checkbox.id}`, checkbox.checked)
    })

    // Mostrar mensaje de éxito
    feedbackElement.textContent = `Great! You've selected ${selectedCount} practices to try.`
    feedbackElement.classList.add("show")
    feedbackElement.setAttribute("aria-live", "polite")

    // Quitar el mensaje después de unos segundos
    setTimeout(() => {
      feedbackElement.classList.remove("show")
    }, 3000)

    // Anunciar para lectores de pantalla
    const ariaLiveRegion = document.createElement("div")
    ariaLiveRegion.setAttribute("aria-live", "polite")
    ariaLiveRegion.className = "sr-only"
    ariaLiveRegion.textContent = `Your selections have been saved. You've selected ${selectedCount} practices to try.`
    document.body.appendChild(ariaLiveRegion)

    // Eliminar después de que se haya anunciado
    setTimeout(() => {
      document.body.removeChild(ariaLiveRegion)
    }, 3000)
  }

  /**
   * Carga las selecciones guardadas de localStorage
   */
  function loadSavedSelections() {
    checkboxes.forEach((checkbox) => {
      const savedValue = localStorage.getItem(`metacognition_${checkbox.id}`)
      if (savedValue === "true") {
        checkbox.checked = true
      }
    })

    // Actualizar estilos después de cargar
    updateCheckboxStyles()
  }
})
