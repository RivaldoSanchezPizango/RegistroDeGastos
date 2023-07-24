import { intlFormat } from "date-fns";
import isThisMonth from "date-fns/isThisMonth";
import parseISO from "date-fns/parseISO";

const cargarTotalGastado = () => {
  const contenedorTotalGastado = document.getElementById('total-gastado');
  const gastos = JSON.parse(window.localStorage.getItem('gastos'));
  let total = 0;
  if (gastos) {
    const gastosDelMes = gastos.filter((gasto) => {
      if (isThisMonth(parseISO(gasto.fecha))) {
        return gasto;
      }
    });
    if (gastosDelMes) {
      gastosDelMes.forEach((gasto) => {
        total += parseFloat(gasto.precio)
      });
    }
    // formateamos el numero i lo agregamos al contenedor
    const formatoMoneda = new Intl.NumberFormat('en-AR', { style: 'currency', currency: 'ARS' })
    contenedorTotalGastado.innerText = formatoMoneda.format(total);
  }
};
export default cargarTotalGastado;