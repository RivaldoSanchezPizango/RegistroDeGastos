import { v4 as uuidv4 } from "uuid";
import { cerrarFormularioGasto } from "./eventoBtnFormularioGasto";
import cargarGastos from "./cargarGastos";
import cargarTotalGastado from "./cargarTotalGastado";

const formulario = document.querySelector('#formulario-gasto form');
const descripcion = formulario.descripcion;
const precio = formulario.precio;

const expRegDescripcion = /^[a-zA-Z0-9\_\- ]{4,30}$/;
const expRegPrecio = /^\d+(\.\d+)?$/

const comprobarDescripcion = () => {
  if (!expRegDescripcion.test(descripcion.value)) {
    descripcion.classList.add('formulario-gasto__input--error');

    formulario.descripcion.parentElement
      .querySelector('.formulario-gasto__leyenda')
      .classList.add('formulario-gasto__leyenda--active');

    return false;
  } else {
    descripcion.classList.remove('formulario-gasto__input--error');

    formulario.descripcion.parentElement
      .querySelector('.formulario-gasto__leyenda')
      .classList.remove('formulario-gasto__leyenda--active')

    return true
  }
}

const comprobarPrecio = () => {
  if (!expRegPrecio.test(precio.value)) {
    precio.classList.add('formulario-gasto__input--error');

    formulario.precio.parentElement
      .querySelector('.formulario-gasto__leyenda')
      .classList.add('formulario-gasto__leyenda--active');

    return false;
  } else {
    precio.classList.remove('formulario-gasto__input--error');

    formulario.precio.parentElement
      .querySelector('.formulario-gasto__leyenda')
      .classList.remove('formulario-gasto__leyenda--active')

    return true
  }
}
// Event Listener para cuando los input descripcion pierde el focus
descripcion.addEventListener('blur', (e) => comprobarDescripcion());
// Event Listener para cuando el input tiene un error y el usuario empieza a escribir para corregirlo
descripcion.addEventListener('keyup', (e) => {
  if ([...e.target.classList].includes('formulario-gasto__input--error')) {
    comprobarDescripcion()
  }
});
// Event Listener para cuando los input precio pierde el focus
precio.addEventListener('blur', (e) => comprobarPrecio());
// Event Listener para cuando el input tiene un error y el usuario empieza a escribir para corregirlo
precio.addEventListener('keyup', (e) => {
  if ([...e.target.classList].includes('formulario-gasto__input--error')) {
    comprobarPrecio()
  }
});

formulario.addEventListener('submit', (e) => {
  e.preventDefault();
  // obtenemos el modo del formulario
  const modo = formulario.closest('#formulario-gasto')?.dataset?.modo;
  // comprobamos que la descripcion y el precio sean correctos
  if (comprobarDescripcion() && comprobarPrecio()) {
    const nuevoGasto = {
      id: uuidv4(),
      fecha: new Date(),
      descripcion: descripcion.value,
      precio: precio.value,
    }
    const gastosGuardados = JSON.parse(window.localStorage.getItem('gastos'));

    if (modo === 'agregarGasto') {
      // Comprobamos si hay gastos
      if (gastosGuardados) {
        // Creamos una nueva lista de gastos que incluya el nuevo
        const nuevosGastos = [...gastosGuardados, nuevoGasto];
        window.localStorage.setItem('gastos', JSON.stringify(nuevosGastos))
      } else {
        // Agregamos el primer gasto
        window.localStorage.setItem('gastos', JSON.stringify([{ ...nuevoGasto }]));
      }
    } else if (modo === 'editarGasto') {
      // obtenemos el ID del gasto a editar
      const id = document.getElementById('formulario-gasto').dataset?.id;
      // obtenemos los valores de la descripcion y el precio.

      // obtenemos el index del elemento a editar
      let indexGastoAEditar;
      if (id && gastosGuardados) {
        gastosGuardados.forEach((gasto, index) => {
          if (gasto.id === id) {
            indexGastoAEditar = index;
          }
        });
      }

      // hacemos una copia de los gastos guardados para poder editarla
      const nuevosGastos = [...gastosGuardados];

      nuevosGastos[indexGastoAEditar] = {
        ...gastosGuardados[indexGastoAEditar],
        descripcion: descripcion.value,
        precio: precio.value,
      };
      // reemplazamos el localStorage con los nuevos gastos
      window.localStorage.setItem('gastos', JSON.stringify(nuevosGastos));
    }

    descripcion.value = '';
    precio.value = '';

    cargarGastos();
    cerrarFormularioGasto();
    cargarTotalGastado();
  }
})