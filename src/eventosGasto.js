import cargarGastos from "./cargarGastos.js"
import cargarTotalGastado from "./cargarTotalGastado.js"
import { abrirFormularioGasto } from "./eventoBtnFormularioGasto";
const contenedorGastos = document.getElementById('gastos');
contenedorGastos.addEventListener('click', (e) => {
  const gasto = e.target.closest('.gasto');

  // comprobamos si estamos haciendo click en un gasto
  if (gasto) {
    if (gasto.scrollLeft > 0) {
      gasto.querySelector('.gasto__info').scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest'
      });
    } else {
      gasto.querySelector('.gasto__acciones').scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest'
      });
    }
  }

  // editar gasto
  if (e.target.closest('[data-accion="editar-gasto"]')) {
    // obtenemos el id del gasto que queremos editar
    const id = gasto.dataset.id;
    // obtenemos los gastos guardados
    const gastosGuardados = JSON.parse(window.localStorage.getItem('gastos'));

    let precio = '';
    let descripcion = '';
    // comprobamos si hay gastos guardados
    if (gastosGuardados && gastosGuardados.length > 0) {
      gastosGuardados.forEach((gasto) => {
        if (gasto.id === id) {
          precio = gasto.precio
          descripcion = gasto.descripcion
        }
      });
      // le ponemos la descripcion y el precio a los input del formulario
      document.querySelector('#formulario-gasto #descripcion').value = descripcion;
      document.querySelector('#formulario-gasto #precio').value = precio;
      document.querySelector('#formulario-gasto').dataset.id = id;

      abrirFormularioGasto('editarGasto');
    }
  }

  //borrar gasto
  if (e.target.closest('[data-accion="eliminar-gasto"]')) {
    // obtenemos el ID del gasto que queremos eliminar
    const id = e.target.closest('.gasto').dataset.id;
    // obtenemos los gastos guardados
    const gastosGuardados = JSON.parse(window.localStorage.getItem('gastos'));

    if (gastosGuardados) {
      const nuevosGastos = gastosGuardados.filter((gasto) => {
        if (gasto.id !== id) {
          return gasto;
        }
      })
      window.localStorage.setItem('gastos', JSON.stringify(nuevosGastos));
    }
    cargarGastos();
    cargarTotalGastado();
  }
})
export default contenedorGastos;