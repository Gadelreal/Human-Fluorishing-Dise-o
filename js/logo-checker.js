document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el logo está presente en la página
  const logoImg = document.querySelector(".logo-container img")

  if (logoImg) {

    // Comprobar si el logo se carga correctamente
    logoImg.addEventListener("load", () => {
      // Añadir una clase para indicar que el logo se ha cargado correctamente
      logoImg.classList.add("logo-loaded")
      document.querySelector(".logo-container").classList.add("logo-container-loaded")
    })

    // Detectar errores de carga
    logoImg.addEventListener("error", () => {
      // Añadir una clase para indicar que hubo un error al cargar el logo
      document.querySelector(".logo-container").classList.add("logo-error")

      // Intentar cargar un logo alternativo
      const isSpanishVersion = window.location.pathname.includes("/es/")
      const alternativePath = isSpanishVersion
        ? "../assets/images/logo-ie-small.svg"
        : "assets/images/logo-ie-small.svg"
      logoImg.src = alternativePath

      // Registrar el intento de carga del logo alternativo
    })
  } else {
    console.error("No se encontró el logo en la página")
  }
})
