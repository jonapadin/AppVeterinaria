export function formatearPrecio(precio: number) {
  return precio.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}