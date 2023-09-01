// Simulador interactivo de plataforma para ver y comprar tickets.
let selected 
const formulario = document.getElementById("formulario")
const checkout = document.getElementById("checkout")

// Consumimos una API propia para obtener la data de los eventos.
fetch('https://64ec9e51f9b2b70f2bfaaa36.mockapi.io/eventos/data/')
.then((res) => res.json())
.then((eventos) => { 
  console.log(eventos)
  // Desestructuro los eventos y los introduzco en el DOM para mostrarlos en cards.
  for (item of eventos) {
    let evento = {
      id: item.id,
      nombre: item.nombre,
      artista: item.artista,
      fecha: item.fecha,
      hora: item.hora,
      venue: item.venue,
      precio: item.precio,
      descripcion: item.descripcion
    }
    cardsCartelera.innerHTML += `
    <div class="card col-4">
      <div class="card-img">
        <img src="img/eventos/${evento.id}.jpeg" class="card-img-top" alt="...">
      </div>
      <div class="card-body">
        <h5 class="card-title">${evento.nombre}</h5>
        <p class="card-text">${evento.artista}</p>
        <a href="#spacingBox" class="btn btn-primary" id="btn-${evento.id}">Seleccionar</a>
      </div>
    </div>
    `
  } 
  // Habilito un event listener en los botones "select" para capturar la selección del usuario, y más adelante mostrar su data expandida.
  eventos.forEach((evento) => {
    const btn = document.getElementById(`btn-${evento.id}`)
    btn.addEventListener('click', () => getMasInfo(evento))
  })
})
.catch((error) => console.error("error fetching data", error))


// data expandida del evento seleccionado
const getMasInfo = (evento) => {
  selected = evento 
  masInfo.innerHTML = `
  <div class="col-6 eventDataL">
  <img src="img/eventos/${evento.id}.jpeg" class="img-thumbnail img-extended1" alt="${evento.nombre}">
  <div>
    <br>
  </div>
  </div>

  <div class="col-6 eventDataR">
    <h2> ${evento.artista} presenta <strong>${evento.nombre}</strong></h2>
    <span>${evento.descripcion}</span>

    <hr class="solid">

    <div class="importantData row container fluid">
      <span>Venue: ${evento.venue}</span>   
      <span>Fecha: ${evento.fecha}</span>
      <span>Hora: ${evento.hora}</span>
      <span>Precio: ${evento.precio}</span>

      <a class="btn btn-primary" id="btnComprar" href="#formAndCheckout">Comprar</a> 
    </div>
  </div>`

  // traigo el boton "comprar" y la sección del formulario
  const btnComprar = document.getElementById("btnComprar")
  const formCheckout = document.getElementById("formAndCheckout")

  // al dar click en comprar, se muestra el formulario 
  btnComprar.addEventListener("click", () => {
      console.log(selected)
      formCheckout.classList.remove("hidden")
  })
}

// form y checkout


formulario.addEventListener("submit", submitForm)

function submitForm(e) {
e.preventDefault()
let form = e.target
let inputNombre = form.children[1].value
let inputApellido = form.children[3].value
let inputMail = form.children[5].value
let inputPass = form.children[7].value
// armo condicionales para prevenir los posibles errores en los inputs, y si todo se cumple bien, se ejecuta la finalizacion de la compra.
if (inputNombre && inputApellido && inputMail && inputPass) {
  Swal.fire({
    title: `${inputNombre}, Solicitaste una entrada para ${selected.nombre} de ${selected.artista}, para el día ${selected.fecha} en ${selected.venue}. ¿Querés confirmar la compra?`,
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: 'Confirmar',
    denyButtonText: `Cancelar`,
  }).then((result) => {
    if (result.isConfirmed) {
      setTimeout(() => {Swal.fire('Compra realizada con éxito. Los detalles te llegarán por mail. Muchas gracias.', '', 'success')}, 3500)
      let timerInterval
      Swal.fire({
      title: 'Procesando pago',
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {
      b.textContent = Swal.getTimerLeft()
    }, 100)
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
})
    } else if (result.isDenied) {
      Swal.fire('Compra cancelada.', '', 'info')
    }
  })

} else {
  inputPass || Toastify({
    text: "Debes Introducir una contraseña válida",
    duration: 5000
    }).showToast();
  
  inputMail || Toastify({
    text: "Debes Introducir tu mail",
    duration: 4600
    }).showToast();
  
  inputApellido || Toastify({
    text: "Debes Introducir tu Apellido",
    duration: 4300
    }).showToast();
  
  inputNombre || Toastify({
    text: "Debes Introducir tu nombre",
    duration: 4000
    }).showToast();
}
}