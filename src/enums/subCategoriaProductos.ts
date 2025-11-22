export const SubcategoriaProducto = {
  ALIMENTOS: "Alimentos",
  ACCESORIOS: "Accesorios",
  ESTETICA_HIGIENE: "Estética e Higiene",
  SALUD: "Salud",
} as const;

export type SubcategoriaProducto = typeof SubcategoriaProducto[keyof typeof SubcategoriaProducto];
