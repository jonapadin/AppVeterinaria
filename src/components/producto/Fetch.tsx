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

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(
          "https://apiv1-vet.onrender.com/api/v1/productos",
        );
        const data: Producto[] = await res.json();

        // VIENEN COMO STRING DESDE DECIMAL)
        const productosTransformados = data.map((p) => ({
          ...p,
            marca: p.marca.trim(),
          kg: p.kg !== null ? Number(p.kg) : null,
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
