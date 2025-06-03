document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el logo está presente en la página
  const logoImg = document.querySelector(".logo-container img")

  if (logoImg) {
    console.log("Logo encontrado en el DOM")

    // Verificar si la ruta del logo es correcta
    console.log("Ruta del logo:", logoImg.src)

    // Comprobar si el logo se carga correctamente
    logoImg.addEventListener("load", () => {
      console.log("Logo cargado correctamente")
      // Añadir una clase para indicar que el logo se ha cargado correctamente
      logoImg.classList.add("logo-loaded")
      document.querySelector(".logo-container").classList.add("logo-container-loaded")
    })

    // Detectar errores de carga
    logoImg.addEventListener("error", () => {
      console.error("Error al cargar el logo:", logoImg.src)
      // Añadir una clase para indicar que hubo un error al cargar el logo
      document.querySelector(".logo-container").classList.add("logo-error")

      // Intentar cargar un logo alternativo
      console.log("Intentando cargar logo alternativo...")
      const isSpanishVersion = window.location.pathname.includes("/es/")
      const alternativePath = isSpanishVersion
        ? "../assets/images/logo-ie-small.svg"
        : "assets/images/logo-ie-small.svg"
      logoImg.src = alternativePath

      // Registrar el intento de carga del logo alternativo
      console.log("Intentando cargar logo alternativo desde:", alternativePath)
    })
  } else {
    console.error("No se encontró el logo en la página")
  }
})
