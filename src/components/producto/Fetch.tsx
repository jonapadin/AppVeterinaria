import { useState, useEffect } from "react";
import type { SubcategoriaProducto } from "../../enums/subCategoriaProductos";
import type { CategoriaProducto } from "../../enums/categoriaProductos";

export interface Producto {
  id: number;
  precio: number;
  stock: number;
  descripcion: string;
  kg: number | null;
  marca: string;
  img: string;
  categoria: CategoriaProducto;
  subcategoria: SubcategoriaProducto;

}
// Custom Hook para obtener productos del backend 
export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]); // Estado donde se guardan los productos
  const [loading, setLoading] = useState<boolean>(true);// Estado que indicar si se está cargando la info

  useEffect(() => {  // Función interna para obtener productos desde la API
    const fetchProductos = async () => {
      try {  // Hacemos la petición al backend y convertimos la respuesta a JSon
        const res = await fetch(
          "http://localhost:4000/api/v1/productos",
        );
        const data: Producto[] = await res.json();

        // VIENEN COMO STRING DESDE DECIMAL)
        const productosTransformados = data.map((p) => ({
          ...p,
            marca: p.marca.trim(),
          kg: p.kg !== null ? Number(p.kg) : null,// convertimos en número
          precio: Number(p.precio),
         
        }));

        setProductos(productosTransformados);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  return { productos, loading };
}
