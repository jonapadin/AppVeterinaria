import { useState, useEffect } from "react";
import type { Producto } from "../producto/Fetch";
import type { CategoriaProducto } from "../../enums/categoriaProductos";
import type { SubcategoriaProducto } from "../../enums/subCategoriaProductos";

interface FiltroProductosProps {
  productos: Producto[];
  categoriaActual: CategoriaProducto;
  subcategoriaActual: SubcategoriaProducto;
  onSelectSubcategoria: (subcategoria: SubcategoriaProducto) => void;
  onChange: (filtros: { presentaciones: string[]; marcas: string[] }) => void;
}

export default function FiltroProductos({
  productos,
  categoriaActual,
  subcategoriaActual,
  onSelectSubcategoria,
  onChange,
}: FiltroProductosProps) {
  
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState<string[]>([]);
  const [kgsSeleccionados, setKgsSeleccionados] = useState<string[]>([]);

  // SUBCATEGORÍAS
  const subcategorias = Array.from(
    new Set(
      productos
        .filter((p) => p.categoria === categoriaActual)
        .map((p) => p.subcategoria)
    )
  );

  // MARCAS
  const marcas = Array.from(
    new Set(
      productos
        .filter(
          (p) =>
            p.categoria === categoriaActual &&
            p.subcategoria === subcategoriaActual
        )
        .map((p) => p.marca)
    )
  );

  // KG (solo números válidos)
  const kgs = Array.from(
    new Set(
      productos
        .filter(
          (p) =>
            p.categoria === categoriaActual &&
            p.subcategoria === subcategoriaActual &&
            p.kg != null &&
            !isNaN(Number(p.kg))
        )
        .map((p) => String(p.kg))
    )
  );

  // Enviar filtros al padre
  useEffect(() => {
    onChange({ marcas: marcasSeleccionadas, presentaciones: kgsSeleccionados });
  }, [marcasSeleccionadas, kgsSeleccionados]);

  // Toggle marca
  const toggleMarca = (marca: string) => {
    setMarcasSeleccionadas((prev) =>
      prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca]
    );
  };

  // Toggle KG
  const toggleKg = (kg: string) => {
    setKgsSeleccionados((prev) =>
      prev.includes(kg) ? prev.filter((k) => k !== kg) : [...prev, kg]
    );
  };

  return (
    <div className="flex flex-col text-center text:lg border-5 border-[#8F108D] p-6 rounded-md">

      {/* Subcategorías */}
      <div>
        <h3 className="font-bold  p-3 bg-[#D9D9D9] text-black">Categorías:</h3>
        <div className="flex flex-col ">
          {subcategorias.map((sub) => (
            <button
              key={sub}
              onClick={() => onSelectSubcategoria(sub as SubcategoriaProducto)}
              className={` py-3 rounded-md ${
                sub === subcategoriaActual
                  ? `bg-[#D9D9D9] text-black`
                  : `bg-white text-[#8F108D] border-[#8F108D]`
              } hover:bg-[#8F108D] hover:text-white transition`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* KG */}
      <div>
        <h3 className="font-bold mb-5 p-3 bg-[#D9D9D9] text-black">
          Presentaciones (kg):
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {kgs.map((kg) => (
            <label
              key={kg}
              className="flex items-center gap-2 rounded p-3 cursor-pointer text-[#8F108D] hover:bg-[#8F108D] hover:text-white transition"
            >
              <input
                type="checkbox"
                checked={kgsSeleccionados.includes(kg)}
                onChange={() => toggleKg(kg)}
              />
              {kg} kg
            </label>
          ))}
        </div>
      </div>

      {/* Marcas */}
      <div>
        <h3 className="font-bold mb-5 p-3 bg-[#D9D9D9] text-black">Marca:</h3>
        <div className="grid grid-cols-2 gap-2">
          {marcas.map((marca) => (
            <label
              key={marca}
              className="flex items-center gap-2 rounded p-1 cursor-pointer text-[#8F108D] hover:bg-[#8F108D] hover:text-white transition"
            >
              <input
                type="checkbox"
                checked={marcasSeleccionadas.includes(marca)}
                onChange={() => toggleMarca(marca)}
              />
              {marca}
            </label>
          ))}
        </div>
      </div>

    </div>
  );
}
