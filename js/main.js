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
    document.addEventListener("scroll", () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        console.log("Usuario ha completado el curso - se activaría el widget de feedback")
      }
    })
  }

  const languageSelector = document.querySelector(".language-selector")
  if (languageSelector) {
    languageSelector.classList.add("language-selector-enhanced")
  }

  const body = document.querySelector("body")
  const menuOverlay = document.createElement("div")
  menuOverlay.className = "menu-overlay"
  body.appendChild(menuOverlay)

  const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
  const mainNav = document.getElementById("main-nav")

  if (mobileMenuToggle && mainNav) {
    if (!mainNav.classList.contains("hamburger-nav")) {
      mainNav.classList.add("hamburger-nav")
    }

    function positionMenu() {
      const toggleRect = mobileMenuToggle.getBoundingClientRect()
      mainNav.style.top = toggleRect.bottom + "px"
      mainNav.style.right = window.innerWidth - toggleRect.right + "px"
      mainNav.style.width = "33.33%"
      if (window.innerWidth <= 768) mainNav.style.width = "50%"
      if (window.innerWidth <= 480) mainNav.style.width = "80%"
    }

    mobileMenuToggle.addEventListener("click", (event) => {
      event.stopPropagation()
      const isActive = mainNav.classList.contains("active")
      mainNav.classList.toggle("active")
      mobileMenuToggle.classList.toggle("active")
      mobileMenuToggle.setAttribute("aria-expanded", (!isActive).toString())
      mobileMenuToggle.setAttribute("aria-label", isActive ? "Abrir menú" : "Cerrar menú")
      if (!isActive) positionMenu()
    })

    window.addEventListener("load", positionMenu)
    window.addEventListener("resize", positionMenu)

    const navLinks = mainNav.querySelectorAll("a")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // No cerrar el menú si es el enlace del glosario, ya que el script del glosario lo maneja
        if (link.id !== "glossary-menu-link") {
          mainNav.classList.remove("active")
          mobileMenuToggle.classList.remove("active")
          mobileMenuToggle.setAttribute("aria-expanded", "false")
        }
      })
    })

    document.addEventListener("click", (event) => {
      if (!mainNav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        mainNav.classList.remove("active")
        mobileMenuToggle.classList.remove("active")
        mobileMenuToggle.setAttribute("aria-expanded", "false")
      }
    })
  }

  const header = document.querySelector(".header-full-bottom")
  if (header) {
    header.classList.add("header-fixed")
    const headerHeight = header.offsetHeight
    const headerSpacer = document.createElement("div")
    headerSpacer.className = "header-spacer"
    headerSpacer.style.height = `${headerHeight}px`
    headerSpacer.setAttribute("aria-hidden", "true")
    header.parentNode.insertBefore(headerSpacer, header.nextSibling)

    function handleScroll() {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
        headerSpacer.classList.add("active")
        headerSpacer.style.height = `${header.offsetHeight}px`
      } else {
        header.classList.remove("scrolled")
        setTimeout(() => {
          headerSpacer.style.height = `${header.offsetHeight}px`
        }, 300)
      }
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    window.addEventListener("resize", () => {
      headerSpacer.style.height = `${header.offsetHeight}px`
    })
  }

  const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
  )
  focusableElements.forEach((element) => {
    if (element.tagName === "A" && !element.getAttribute("role")) {
      if (!element.getAttribute("href") || element.getAttribute("href") === "#") {
        element.setAttribute("role", "button")
      }
    }
    if (element.getAttribute("role") === "button" || element.tagName === "BUTTON") {
      element.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          element.click()
        }
      })
    }
  })

  const skipLink = document.createElement("a")
  skipLink.href = "#main-content"
  skipLink.className = "skip-to-content"
  skipLink.textContent = "Saltar al contenido principal"
  document.body.insertBefore(skipLink, document.body.firstChild)

  const mainContent = document.querySelector("main")
  if (mainContent && !mainContent.id) {
    mainContent.id = "main-content"
    mainContent.setAttribute("tabindex", "-1")
  }

  // Ajustar el scroll para los enlaces internos (tanto en página como en modales)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href")
      if (targetId === "#" || !targetId.startsWith("#")) return // Ignorar enlaces vacíos o no anclas

      const modalBody = this.closest(".modal-body") // Comprobar si el enlace está dentro de un modal-body

      if (modalBody) {
        // Enlace dentro de un modal (ej. glosario)
        const targetElement = modalBody.querySelector(targetId) // Buscar el destino DENTRO del modal
        if (targetElement) {
          e.preventDefault()
          // Desplazar el contenido del modal para que targetElement esté cerca de la parte superior
          // targetElement.offsetTop es relativo al offsetParent. Si modal-body es position:relative y
          // los .glossary-section son hijos directos o de hijos estáticos, esto funciona.
          modalBody.scrollTo({
            top: targetElement.offsetTop - 10, // 10px de espacio desde la parte superior del viewport del modal
            behavior: "smooth",
          })
        }
      } else {
        // Enlace en la página principal
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          e.preventDefault()
          const pageHeader = document.querySelector("header.header-full-bottom")
          const headerHeight = pageHeader ? pageHeader.offsetHeight : 0
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20 // 20px de espacio adicional

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      }
    })
  })

  // Si la URL tiene un hash al cargar la página, ajustar el scroll (solo para anclas de página)
  if (window.location.hash) {
    setTimeout(() => {
      // Asegurarse de que el elemento no esté dentro de un modal para el scroll inicial de página
      const targetElement = document.querySelector(window.location.hash)
      if (targetElement && !targetElement.closest(".modal")) {
        // Solo si no está en un modal
        const pageHeader = document.querySelector("header.header-full-bottom")
        const headerHeight = pageHeader ? pageHeader.offsetHeight : 0
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    }, 100) // Pequeño retraso para asegurar que todo esté cargado
  }
})

function changeLanguage(lang) {
  const currentPath = window.location.pathname
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
  if (lang === "en") {
    window.location.href = `/${pageName}`
  } else {
    window.location.href = `/es/${pageName}`
  }
}
