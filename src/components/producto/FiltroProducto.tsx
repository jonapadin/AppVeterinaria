import { useEffect, useState } from "react";
import productosJson from "./producto.json";

interface FiltroProps {
  categoriaActual: string;
  subcategoriaActual: string;
  onSelectSubcategoria: (subcategoria: string) => void;
  onChange: (filtros: { presentaciones: string[]; marcas: string[] }) => void;
}

interface Producto {
  marca: string;
  presentacion: string;
}

export default function FiltroProductos({
  categoriaActual,
  subcategoriaActual,
  onSelectSubcategoria,
  onChange,
}: FiltroProps) {
  const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);
  const [presentacionesDisponibles, setPresentacionesDisponibles] = useState<
    string[]
  >([]);
  const [selectedMarcas, setSelectedMarcas] = useState<string[]>([]);
  const [selectedPresentaciones, setSelectedPresentaciones] = useState<
    string[]
  >([]);

  
  const productosCategoria = (productosJson as any)
    .flatMap((item: any) => item.categoria[categoriaActual] ?? {})
    .reduce((acc: any, cur: any) => ({ ...acc, ...cur }), {});

  useEffect(() => {
    if (!productosCategoria) return;

    const productos: Producto[] = productosCategoria[subcategoriaActual] || [];

   
    const marcas = Array.from(
      new Set(productos.map((p) => (p.marca?.trim() ?? "") as string))
    );

    const presentaciones = Array.from(
      new Set(productos.map((p) => (p.presentacion?.trim() ?? "") as string))
    );

    setMarcasDisponibles(marcas);
    setPresentacionesDisponibles(presentaciones);
  }, [categoriaActual, subcategoriaActual]);

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
      prev.includes(presentacion)
        ? prev.filter((p) => p !== presentacion)
        : [...prev, presentacion]
    );

  return (
    <div className="hidden md:block border-2 border-[#8F108D] rounded-lg bg-white">

      {/* CATEGORÍAS */}
      <h3 className="bg-gray-300 border-b-2 border-[#8F108D] text-center font-semibold py-2">
        Categorías:
      </h3>
      <div className="p-3 bg-gray-200">
        {Object.keys(productosCategoria).map((sub) => (
          <button
            key={sub}
            className={`w-full py-1 ${
              sub === subcategoriaActual ? "font-bold text-[#8F108D]" : ""
            }`}
            onClick={() => onSelectSubcategoria(sub)}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* PRESENTACIONES */}
      <h3 className="bg-gray-300 border-t-2 border-b-2 border-[#8F108D] text-center font-semibold py-2">
        Presentaciones (Kg):
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

      {/* MARCAS */}
      <h3 className="bg-gray-300 border-b-2 border-[#8F108D] text-center font-semibold py-2">
        Marca:
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
