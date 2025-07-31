// Actualizar el año del copyright automáticamente
document.addEventListener("DOMContentLoaded", () => {
  const currentYearElement = document.getElementById("current-year")
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear()
  }

  // Detectar cuando el usuario ha completado el último capítulo
  const courseCompletedElement = document.getElementById("course-completed")
  if (
    courseCompletedElement &&
    (window.location.pathname.includes("chapter5.html") || window.location.pathname.includes("capitulo5.html"))
  ) {
    // Cuando el usuario llega al final del contenido del capítulo 5
    // Esto se activaría con algún evento o acción del usuario
    // Por ahora, solo preparamos el código para futuras funcionalidades
    document.addEventListener("scroll", () => {
      // Verificar si el usuario ha llegado al final de la página
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        console.log("Usuario ha completado el curso - se activaría el widget de feedback")
        // Descomentar cuando se implemente la funcionalidad completa
        // document.dispatchEvent(new CustomEvent('ie-feedback-widget-openModal'));
      }
    })
  }

  // Añadir funcionalidad para el selector de idioma móvil
  const languageSelector = document.querySelector(".language-selector")
  if (languageSelector) {
    // Añadir clase para estilos mejorados
    languageSelector.classList.add("language-selector-enhanced")
  }

  // Añadir overlay para cerrar el menú al hacer clic fuera
  const body = document.querySelector("body")
  const menuOverlay = document.createElement("div")
  menuOverlay.className = "menu-overlay"
  body.appendChild(menuOverlay)

  // Actualizar el evento del menú hamburguesa
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
  const mainNav = document.getElementById("main-nav")

  if (mobileMenuToggle && mainNav) {
    // Asegurarse de que el menú tenga la clase correcta para los estilos
    if (!mainNav.classList.contains("hamburger-nav")) {
      mainNav.classList.add("hamburger-nav")
    }

    // Posicionar el menú correctamente
    function positionMenu() {
      // Obtener la posición del botón hamburguesa
      const toggleRect = mobileMenuToggle.getBoundingClientRect()

      // Posicionar el menú justo debajo del botón y alineado a la derecha
      mainNav.style.top = toggleRect.bottom + "px"
      mainNav.style.right = window.innerWidth - toggleRect.right + "px"

      // Asegurar que el menú tenga el ancho correcto
      mainNav.style.width = "33.33%"

      // Ajustar para dispositivos móviles
      if (window.innerWidth <= 768) {
        mainNav.style.width = "50%"
      }
      if (window.innerWidth <= 480) {
        mainNav.style.width = "80%"
      }
    }

    mobileMenuToggle.addEventListener("click", (event) => {
      event.stopPropagation()

      const isActive = mainNav.classList.contains("active")

      // Toggle clases
      mainNav.classList.toggle("active")
      mobileMenuToggle.classList.toggle("active")

      // Actualizar ARIA
      mobileMenuToggle.setAttribute("aria-expanded", (!isActive).toString())
      mobileMenuToggle.setAttribute("aria-label", isActive ? "Abrir menú" : "Cerrar menú")

      // Posicionar el menú cuando se abre
      if (!isActive) {
        positionMenu()
      }
    })

    // Posicionar el menú al cargar la página
    window.addEventListener("load", positionMenu)

    // Actualizar la posición al cambiar el tamaño de la ventana
    window.addEventListener("resize", positionMenu)

    // Cerrar el menú al hacer clic en un enlace
    const navLinks = mainNav.querySelectorAll("a")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("active")
        mobileMenuToggle.classList.remove("active")
        mobileMenuToggle.setAttribute("aria-expanded", "false")
      })
    })

    // Cerrar el menú al hacer clic fuera
    document.addEventListener("click", (event) => {
      if (!mainNav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        mainNav.classList.remove("active")
        mobileMenuToggle.classList.remove("active")
        mobileMenuToggle.setAttribute("aria-expanded", "false")
      }
    })
  }

  // Funcionalidad para el header fijo que se reduce al hacer scroll
  const header = document.querySelector(".header-full-bottom")
  if (header) {
    // Añadir clase para posición fija
    header.classList.add("header-fixed")

    // Crear un espaciador para compensar la altura del header
    const headerHeight = header.offsetHeight
    const headerSpacer = document.createElement("div")
    headerSpacer.className = "header-spacer"
    headerSpacer.style.height = `${headerHeight}px`
    headerSpacer.setAttribute("aria-hidden", "true") // Ocultar para lectores de pantalla

    // Insertar el espaciador después del header
    header.parentNode.insertBefore(headerSpacer, header.nextSibling)

    // Función para manejar el evento de scroll
    function handleScroll() {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
        headerSpacer.classList.add("active")
        headerSpacer.style.height = `${header.offsetHeight}px`
      } else {
        header.classList.remove("scrolled")
        // Actualizar la altura del espaciador cuando el header vuelve a su tamaño original
        setTimeout(() => {
          headerSpacer.style.height = `${header.offsetHeight}px`
        }, 300) // Esperar a que termine la transición
      }
    }

    // Añadir el evento de scroll
    window.addEventListener("scroll", handleScroll)

    // Llamar a la función una vez para configurar el estado inicial
    handleScroll()

    // Actualizar la altura del espaciador cuando cambia el tamaño de la ventana
    window.addEventListener("resize", () => {
      headerSpacer.style.height = `${header.offsetHeight}px`
    })
  }

  // Añadir soporte para navegación por teclado
  const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
  )

  focusableElements.forEach((element) => {
    // Asegurar que los elementos interactivos tengan roles adecuados
    if (element.tagName === "A" && !element.getAttribute("role")) {
      if (!element.getAttribute("href") || element.getAttribute("href") === "#") {
        element.setAttribute("role", "button")
      }
    }

    // Añadir manejo de eventos de teclado para elementos que actúan como botones
    if (element.getAttribute("role") === "button" || element.tagName === "BUTTON") {
      element.addEventListener("keydown", (e) => {
        // Activar con Enter o Space
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          element.click()
        }
      })
    }
  })

  // Añadir soporte para saltar al contenido principal
  const skipLink = document.createElement("a")
  skipLink.href = "#main-content"
  skipLink.className = "skip-to-content"
  skipLink.textContent = "Saltar al contenido principal"
  document.body.insertBefore(skipLink, document.body.firstChild)

  // Asegurar que el contenido principal tenga un ID para el enlace de salto
  const mainContent = document.querySelector("main")
  if (mainContent && !mainContent.id) {
    mainContent.id = "main-content"
    mainContent.setAttribute("tabindex", "-1") // Permite enfocar sin añadir al orden de tabulación
  }

  // Ajustar el scroll para los enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return // Ignorar enlaces con href="#"

      const targetElement = document.querySelector(targetId)
      if (!targetElement) return // Si el elemento no existe, no hacer nada

      // Calcular la posición de desplazamiento considerando la altura de la cabecera
      const headerHeight = document.querySelector("header").offsetHeight
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20 // 20px de espacio adicional

      // Desplazarse a la posición calculada
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    })
  })

  // Si la URL tiene un hash al cargar la página, ajustar el scroll
  if (window.location.hash) {
    setTimeout(() => {
      const targetElement = document.querySelector(window.location.hash)
      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    }, 100) // Pequeño retraso para asegurar que esté cargado
  }
})

// Función para cambiar el idioma
function changeLanguage(lang) {
  // Obtener la ruta actual
  const currentPath = window.location.pathname

  // Determinar la página actual
  let pageName = "index.html"

  if (currentPath.includes("introduction.html") || currentPath.includes("introduccion.html")) {
    pageName = lang === "en" ? "introduction.html" : "introduccion.html"
  } else if (currentPath.includes("chapter1.html") || currentPath.includes("capitulo1.html")) {
    pageName = lang === "en" ? "chapter1.html" : "capitulo1.html"
  } else if (currentPath.includes("chapter2.html") || currentPath.includes("capitulo2.html")) {
    pageName = lang === "en" ? "chapter2.html" : "capitulo2.html"
  } else if (currentPath.includes("chapter3.html") || currentPath.includes("capitulo3.html")) {
    pageName = lang === "en" ? "chapter3.html" : "capitulo3.html"
  } else if (currentPath.includes("chapter4.html") || currentPath.includes("capitulo4.html")) {
    pageName = lang === "en" ? "chapter4.html" : "capitulo4.html"
  } else if (currentPath.includes("chapter5.html") || currentPath.includes("capitulo5.html")) {
    pageName = lang === "en" ? "chapter5.html" : "capitulo5.html"
  }

  // Redirigir a la versión del idioma seleccionado
  if (lang === "en") {
    window.location.href = `/${pageName}`
  } else {
    window.location.href = `/es/${pageName}`
  }
}
