export const CategoriaProducto = {
 PERRO: "Perro",
  GATO: "Gato",
  AVE: "Ave",
  EXOTICO:"Exótico",

} as const;

export type CategoriaProducto = typeof CategoriaProducto[keyof typeof CategoriaProducto];