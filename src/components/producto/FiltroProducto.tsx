import { useEffect, useState } from "react";
import type { Producto } from "./Fetch";

interface FiltroProps {
  productos: Producto[];
  categoriaActual: string;
  subcategoriaActual: string;
  onSelectSubcategoria: (subcategoria: string) => void;
  onChange: (filtros: { presentaciones: string[]; marcas: string[] }) => void;
}

export default function FiltroProductos({
  productos,
  categoriaActual,
  subcategoriaActual,
  onSelectSubcategoria,
  onChange,
}: FiltroProps) {
  const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);
  const [presentacionesDisponibles, setPresentacionesDisponibles] = useState<string[]>([]);
  const [selectedMarcas, setSelectedMarcas] = useState<string[]>([]);
  const [selectedPresentaciones, setSelectedPresentaciones] = useState<string[]>([]);

  useEffect(() => {
    const productosFiltrados = productos.filter(
      (p) => p.categoria === categoriaActual && p.subcategoria === subcategoriaActual
    );

    const marcas = Array.from(new Set(productosFiltrados.map((p) => p.marca)));
    const presentaciones = Array.from(new Set(productosFiltrados.map((p) => p.kg.toString())));

    setMarcasDisponibles(marcas);
    setPresentacionesDisponibles(presentaciones);
  }, [productos, categoriaActual, subcategoriaActual]);

  useEffect(() => {
    onChange({
      marcas: selectedMarcas,
      presentaciones: selectedPresentaciones,
    });
  }, [selectedMarcas, selectedPresentaciones]);

  const toggleMarca = (marca: string) =>
    setSelectedMarcas((prev) =>
      prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca]
    );

  const togglePresentacion = (presentacion: string) =>
    setSelectedPresentaciones((prev) =>
      prev.includes(presentacion) ? prev.filter((p) => p !== presentacion) : [...prev, presentacion]
    );

  return (
    <div className="hidden md:block border-2 border-[#8F108D] rounded-lg bg-white">
      {/* Subcategorías */}
      <h3 className="bg-gray-300 border-b-2 border-[#8F108D] text-center font-semibold py-2">
        Subcategorías
      </h3>
      <div className="p-3 bg-gray-200">
        {[...new Set(productos.filter((p) => p.categoria === categoriaActual).map((p) => p.subcategoria))].map((sub) => (
          <button
            key={sub}
            className={`w-full py-1 ${sub === subcategoriaActual ? "font-bold text-[#8F108D]" : ""}`}
            onClick={() => onSelectSubcategoria(sub)}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Presentaciones */}
      <h3 className="bg-gray-300 border-t-2 border-b-2 border-[#8F108D] text-center font-semibold py-2">
        Presentaciones (Kg)
      </h3>
      <div className="grid grid-cols-2 gap-2 p-4 border-b-2 border-[#8F108D]">
        {presentacionesDisponibles.map((pre) => (
          <label key={pre} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="w-4 h-4 border-2 border-[#8F108D] accent-[#8F108D] appearance-none checked:bg-[#8F108D] checked:border-[#8F108D] cursor-pointer"
              onChange={() => togglePresentacion(pre)}
            />
            {pre}
          </label>
        ))}
      </div>

      {/* Marcas */}
      <h3 className="bg-gray-300 border-b-2 border-[#8F108D] text-center font-semibold py-2">
        Marca
      </h3>
      <div className="flex flex-col gap-2 p-4">
        {marcasDisponibles.map((marca) => (
          <label key={marca} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="w-4 h-4 border-2 border-[#8F108D] accent-[#8F108D] appearance-none checked:bg-[#8F108D] checked:border-[#8F108D] cursor-pointer"
              onChange={() => toggleMarca(marca)}
            />
            {marca}
          </label>
        ))}
      </div>
    </div>
  );
}
