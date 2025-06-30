document.addEventListener("DOMContentLoaded", () => {
  // Mejorar el efecto hover en las opciones
  const quizOptions = document.querySelectorAll(".quiz-options li")
  quizOptions.forEach((option) => {
    option.addEventListener("mouseenter", () => {
      option.style.transform = "translateY(-2px)"
      option.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"
      option.style.transition = "all 0.2s ease"
    })

    option.addEventListener("mouseleave", () => {
      option.style.transform = "translateY(0)"
      option.style.boxShadow = "none"
    })
  })

  // Configuración del quiz
  const correctAnswers = {
    1: "C",
    2: "C",
    3: "C",
    4: "B",
    5: "B",
    6: "B",
    7: "B",
    8: "B",
    9: "C",
    10: "B",
  }

  const userAnswers = {}
  let quizCompleted = false

  // Load saved answers from localStorage
  function loadSavedQuizAnswers() {
    const savedAnswers = localStorage.getItem("final_quiz_answers")
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers)
        Object.assign(userAnswers, parsedAnswers)

        // Apply saved answers to the UI
        Object.keys(parsedAnswers).forEach((questionNumber) => {
          const selectedAnswer = parsedAnswers[questionNumber]
          // Usar un selector más específico basado en el número de pregunta
          const questionElement = getQuestionElementByNumber(questionNumber)
          if (questionElement) {
            const options = questionElement.querySelectorAll(".quiz-options li")
            const selectedOption = Array.from(options).find(
              (option) => option.getAttribute("data-answer") === selectedAnswer,
            )
            if (selectedOption) {
              // Simulate the answer selection to restore the visual state
              handleAnswerSelection(Number.parseInt(questionNumber), selectedAnswer, selectedOption, true)
            }
          }
        })
      } catch (e) {
        console.warn("Error loading saved quiz answers:", e)
      }
    }
  }

  // Función helper para obtener el elemento de pregunta por número
  function getQuestionElementByNumber(questionNumber) {
    const allQuestions = document.querySelectorAll(".quiz-question")
    return allQuestions[questionNumber - 1] // Array es 0-indexed, preguntas son 1-indexed
  }

  // Save quiz answers to localStorage
  function saveQuizAnswers() {
    try {
      localStorage.setItem("final_quiz_answers", JSON.stringify(userAnswers))
    } catch (e) {
      console.warn("Error saving quiz answers:", e)
    }
  }

  // Inicializar el quiz
  initializeQuiz()

  function initializeQuiz() {
    const quizQuestions = document.querySelectorAll(".quiz-question")

    quizQuestions.forEach((question, index) => {
      const questionNumber = index + 1
      const options = question.querySelectorAll(".quiz-options li")

      // Añadir atributo data-question-number al elemento de pregunta para facilitar la búsqueda
      question.setAttribute("data-question-number", questionNumber)

      options.forEach((option, optionIndex) => {
        const optionLetter = String.fromCharCode(65 + optionIndex) // A, B, C, D

        // Añadir atributos de accesibilidad SOLO a las opciones
        option.setAttribute("role", "button")
        option.setAttribute("tabindex", "0")
        option.setAttribute("aria-label", `Option ${optionLetter}: ${option.textContent}`)
        option.setAttribute("data-question", questionNumber)
        option.setAttribute("data-answer", optionLetter)

        // Event listeners para click y teclado SOLO en las opciones
        option.addEventListener("click", () => handleAnswerSelection(questionNumber, optionLetter, option))
        option.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleAnswerSelection(questionNumber, optionLetter, option)
          }
        })
      })
    })

    // Añadir botón de reset al final del quiz
    addResetButton()
    // Load any previously saved answers
    loadSavedQuizAnswers()
  }

  function handleAnswerSelection(questionNumber, selectedAnswer, selectedElement, isLoadingSaved = false) {
    // Prevenir cambios si ya se respondió esta pregunta y no estamos cargando respuestas guardadas
    if (userAnswers[questionNumber] && !isLoadingSaved) {
      return
    }

    // Guardar la respuesta del usuario
    userAnswers[questionNumber] = selectedAnswer

    // Save to localStorage
    if (!isLoadingSaved) {
      saveQuizAnswers()
    }

    // Obtener todas las opciones de esta pregunta
    const questionElement = selectedElement.closest(".quiz-question")
    const allOptions = questionElement.querySelectorAll(".quiz-options li")

    // Deshabilitar todas las opciones de esta pregunta
    allOptions.forEach((option) => {
      option.style.pointerEvents = "none"
      option.setAttribute("aria-disabled", "true")
    })

    // Verificar si la respuesta es correcta
    const isCorrect = selectedAnswer === correctAnswers[questionNumber]

    // Limpiar iconos previos si existen (para el caso de cargar respuestas guardadas)
    allOptions.forEach((option) => {
      const existingIcons = option.querySelectorAll("i.fas")
      existingIcons.forEach((icon) => icon.remove())
    })

    if (isCorrect) {
      // Respuesta correcta
      selectedElement.style.backgroundColor = "#d4edda"
      selectedElement.style.borderColor = "#c3e6cb"
      selectedElement.style.color = "#155724"

      // Añadir icono de correcto
      const checkIcon = document.createElement("i")
      checkIcon.className = "fas fa-check"
      checkIcon.style.cssText = "color: #28a745; margin-left: 0.5rem;"
      checkIcon.setAttribute("aria-hidden", "true")
      selectedElement.appendChild(checkIcon)

      // Añadir mensaje de feedback solo si no existe ya
      let feedbackElement = questionElement.querySelector(".quiz-feedback.correct")
      if (!feedbackElement) {
        feedbackElement = document.createElement("div")
        feedbackElement.className = "quiz-feedback correct"
        feedbackElement.innerHTML = '<i class="fas fa-check-circle" aria-hidden="true"></i> Correct! Excellent work.'
        feedbackElement.style.cssText = `
          margin-top: 0.5rem;
          padding: 0.5rem;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 4px;
          color: #155724;
          font-weight: 500;
        `
        questionElement.appendChild(feedbackElement)
      }
    } else {
      // Respuesta incorrecta
      selectedElement.style.backgroundColor = "#f8d7da"
      selectedElement.style.borderColor = "#f5c6cb"
      selectedElement.style.color = "#721c24"

      // Añadir icono de incorrecto
      const timesIcon = document.createElement("i")
      timesIcon.className = "fas fa-times"
      timesIcon.style.cssText = "color: #dc3545; margin-left: 0.5rem;"
      timesIcon.setAttribute("aria-hidden", "true")
      selectedElement.appendChild(timesIcon)

      // Mostrar la respuesta correcta
      const correctOption = Array.from(allOptions).find(
        (option) => option.getAttribute("data-answer") === correctAnswers[questionNumber],
      )

      if (correctOption) {
        correctOption.style.backgroundColor = "#d1ecf1"
        correctOption.style.borderColor = "#bee5eb"
        correctOption.style.color = "#0c5460"

        // Añadir icono de respuesta correcta
        const correctCheckIcon = document.createElement("i")
        correctCheckIcon.className = "fas fa-check"
        correctCheckIcon.style.cssText = "color: #17a2b8; margin-left: 0.5rem;"
        correctCheckIcon.setAttribute("aria-hidden", "true")
        correctOption.appendChild(correctCheckIcon)
      }

      // Añadir mensaje de feedback solo si no existe ya
      let feedbackElement = questionElement.querySelector(".quiz-feedback.incorrect")
      if (!feedbackElement) {
        feedbackElement = document.createElement("div")
        feedbackElement.className = "quiz-feedback incorrect"
        feedbackElement.innerHTML = `
          <i class="fas fa-times-circle" aria-hidden="true"></i> 
          Incorrect. The correct answer is: ${correctAnswers[questionNumber]}
        `
        feedbackElement.style.cssText = `
          margin-top: 0.5rem;
          padding: 0.5rem;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          color: #721c24;
          font-weight: 500;
        `
        questionElement.appendChild(feedbackElement)
      }
    }

    // Anunciar el resultado para lectores de pantalla (solo si no estamos cargando respuestas guardadas)
    if (!isLoadingSaved) {
      const announcement = document.createElement("div")
      announcement.setAttribute("aria-live", "polite")
      announcement.className = "sr-only"
      announcement.textContent = isCorrect
        ? "Correct answer"
        : `Incorrect answer. The correct answer is ${correctAnswers[questionNumber]}`
      document.body.appendChild(announcement)

      // Eliminar el anuncio después de que se haya leído
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement)
        }
      }, 3000)
    }

    // Verificar si el quiz está completo
    checkQuizCompletion()
  }

  function addResetButton() {
    // Buscar el contenedor del quiz o la sección que contiene las preguntas
    const quizSection = document.querySelector(".lesson-section:has(.quiz-question)")

    if (quizSection) {
      // Verificar si ya existe un botón de reset
      const existingResetButton = quizSection.querySelector(".quiz-reset-container")
      if (existingResetButton) {
        return // Ya existe, no crear otro
      }

      const resetButtonContainer = document.createElement("div")
      resetButtonContainer.className = "quiz-reset-container"
      resetButtonContainer.style.cssText = `
        text-align: center;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 2px solid #e0e0e0;
      `

      const resetButton = document.createElement("button")
      resetButton.className = "save-button"
      resetButton.innerHTML = '<i class="fas fa-redo" aria-hidden="true"></i> Reset Quiz'
      resetButton.style.cssText = `
        background-color: #6c757d;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      `

      resetButton.addEventListener("click", resetQuiz)
      resetButton.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          resetQuiz()
        }
      })

      resetButton.addEventListener("mouseenter", () => {
        resetButton.style.backgroundColor = "#5a6268"
        resetButton.style.transform = "translateY(-2px)"
      })

      resetButton.addEventListener("mouseleave", () => {
        resetButton.style.backgroundColor = "#6c757d"
        resetButton.style.transform = "translateY(0)"
      })

      resetButtonContainer.appendChild(resetButton)

      // Insertar el botón después de la última pregunta del quiz
      const lastQuestion = quizSection.querySelector(".quiz-question:last-of-type")
      if (lastQuestion) {
        lastQuestion.parentNode.insertBefore(resetButtonContainer, lastQuestion.nextSibling)
      } else {
        quizSection.appendChild(resetButtonContainer)
      }
    }
  }

  function resetQuiz() {
    // Limpiar respuestas del usuario
    Object.keys(userAnswers).forEach((key) => delete userAnswers[key])
    quizCompleted = false

    // Clear saved answers from localStorage
    try {
      localStorage.removeItem("final_quiz_answers")
    } catch (e) {
      console.warn("Error clearing saved quiz answers:", e)
    }

    // Resetear todas las preguntas
    const quizQuestions = document.querySelectorAll(".quiz-question")

    quizQuestions.forEach((question) => {
      const options = question.querySelectorAll(".quiz-options li")

      // Restaurar estilos originales de las opciones
      options.forEach((option) => {
        option.style.backgroundColor = "#f8f8f8"
        option.style.borderColor = "#e0e0e0"
        option.style.color = "#000"
        option.style.pointerEvents = "auto"
        option.removeAttribute("aria-disabled")

        // Eliminar iconos de respuesta
        const icons = option.querySelectorAll("i.fas")
        icons.forEach((icon) => icon.remove())
      })

      // Eliminar mensajes de feedback
      const feedbackElements = question.querySelectorAll(".quiz-feedback")
      feedbackElements.forEach((feedback) => feedback.remove())
    })

    // Eliminar resultados del quiz si existen
    const existingResults = document.querySelector(".quiz-results")
    if (existingResults) {
      existingResults.remove()
    }

    // Scroll al inicio del quiz
    const firstQuestion = document.querySelector(".quiz-question")
    if (firstQuestion) {
      firstQuestion.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    // Anunciar el reset para lectores de pantalla
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.className = "sr-only"
    announcement.textContent = "Quiz reset. You can now answer all questions again."
    document.body.appendChild(announcement)

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement)
      }
    }, 3000)
  }

  function checkQuizCompletion() {
    const totalQuestions = Object.keys(correctAnswers).length
    const answeredQuestions = Object.keys(userAnswers).length

    if (answeredQuestions === totalQuestions && !quizCompleted) {
      quizCompleted = true

      // Calcular puntuación
      const correctCount = Object.keys(userAnswers).filter(
        (questionNum) => userAnswers[questionNum] === correctAnswers[questionNum],
      ).length

      const percentage = Math.round((correctCount / totalQuestions) * 100)

      // Mostrar resultado final
      setTimeout(() => {
        showQuizResults(correctCount, totalQuestions, percentage)
      }, 1000)
    }
  }

  function showQuizResults(correctCount, totalQuestions, percentage) {
    // Buscar el contenedor del quiz
    const quizSection = document.querySelector(".lesson-section:has(.quiz-question)")

    if (quizSection) {
      // Eliminar resultados previos si existen
      const existingResults = quizSection.querySelector(".quiz-results")
      if (existingResults) {
        existingResults.remove()
      }

      const resultsElement = document.createElement("div")
      resultsElement.className = "quiz-results"
      resultsElement.style.cssText = `
        margin-top: 2rem;
        padding: 1.5rem;
        background-color: ${percentage >= 70 ? "#d4edda" : "#fff3cd"};
        border: 2px solid ${percentage >= 70 ? "#c3e6cb" : "#ffeaa7"};
        border-radius: 8px;
        text-align: center;
        color: ${percentage >= 70 ? "#155724" : "#856404"};
      `

      const icon = percentage >= 70 ? "fa-trophy" : "fa-chart-bar"
      const message = percentage >= 70 ? "Excellent work!" : "Good attempt! Consider reviewing the course material."

      resultsElement.innerHTML = `
        <h3 style="margin-top: 0; margin-bottom: 1rem;">
          <i class="fas ${icon}" aria-hidden="true"></i> Quiz Results
        </h3>
        <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">
          <strong>${correctCount} of ${totalQuestions} correct answers</strong>
        </p>
        <p style="font-size: 1.4rem; font-weight: bold; margin-bottom: 1rem;">
          Score: ${percentage}%
        </p>
        <p style="margin-bottom: 0;">${message}</p>
      `

      // Insertar después del botón de reset o al final de la sección
      const resetContainer = quizSection.querySelector(".quiz-reset-container")
      if (resetContainer) {
        resetContainer.parentNode.insertBefore(resultsElement, resetContainer.nextSibling)
      } else {
        quizSection.appendChild(resultsElement)
      }

      // Scroll a los resultados
      resultsElement.scrollIntoView({ behavior: "smooth", block: "center" })

      // Anunciar resultados para lectores de pantalla
      const announcement = document.createElement("div")
      announcement.setAttribute("aria-live", "polite")
      announcement.className = "sr-only"
      announcement.textContent = `Quiz completed. You got ${correctCount} of ${totalQuestions} correct answers. Your score is ${percentage} percent.`
      document.body.appendChild(announcement)

      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement)
        }
      }, 5000)
    }
  }

  // Función para obtener estadísticas del quiz (opcional)
  function getQuizStatistics() {
    const totalQuestions = Object.keys(correctAnswers).length
    const answeredQuestions = Object.keys(userAnswers).length
    const correctCount = Object.keys(userAnswers).filter(
      (questionNum) => userAnswers[questionNum] === correctAnswers[questionNum],
    ).length

    return {
      totalQuestions,
      answeredQuestions,
      correctCount,
      percentage: answeredQuestions > 0 ? Math.round((correctCount / answeredQuestions) * 100) : 0,
      isComplete: answeredQuestions === totalQuestions,
      userAnswers: { ...userAnswers },
      correctAnswers: { ...correctAnswers },
    }
  }

  // Hacer la función de estadísticas disponible globalmente (opcional)
  window.getQuizStatistics = getQuizStatistics
})
