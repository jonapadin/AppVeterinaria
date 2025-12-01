import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp} from "lucide-react"; 
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

  // Mobile
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openKg, setOpenKg] = useState(false);
  const [openMarca, setOpenMarca] = useState(false);

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

  // KG
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

  useEffect(() => {
    onChange({ marcas: marcasSeleccionadas, presentaciones: kgsSeleccionados });
  }, [marcasSeleccionadas, kgsSeleccionados]);

  const toggleMarca = (marca: string) => {
    setMarcasSeleccionadas((prev) =>
      prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca]
    );
  };

  const toggleKg = (kg: string) => {
    setKgsSeleccionados((prev) =>
      prev.includes(kg) ? prev.filter((k) => k !== kg) : [...prev, kg]
    );
  };

  return (
    <>
      {/* BOTÓN FILTRAR MOBILE (hasta LG) */}
      <div className="lg:hidden mt-6 w-full flex justify-center">
        <button
          onClick={() => setOpenMobileMenu(!openMobileMenu)}
          className="flex items-center gap-2 bg-white text-black border-[#8F108D] border-3 px-4 py-2 text-sm rounded-md"
        >
          Filtrar
          {openKg ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* FILTRO MOBILE */}
      {openMobileMenu && (
        <div className="lg:hidden flex flex-col text-center xs:text-sm border-3 border-[#8F108D] p-2 rounded-md">

        {/* PRESENTACIONES — solo si existen kg */}
{kgs.length > 0 && (
  <>
    <button
      onClick={() => setOpenKg(!openKg)}
      className="font-bold p-1 bg-[#D9D9D9] text-black w-full flex justify-between items-center"
    >
      Presentaciones (kg)
      {openKg ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>

    {openKg && (
      <div className="grid grid-cols-2 gap-2 mb-2">
        {kgs.map((kg) => (
          <label
            key={kg}
            className="flex items-center gap-2 rounded p-2 cursor-pointer text-[#8F108D] hover:bg-[#8F108D] hover:text-white transition"
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
    )}
  </>
)}
          {/* MARCAS */}
          <button
            onClick={() => setOpenMarca(!openMarca)}
            className="font-bold mb-3 p-3 bg-[#D9D9D9] text-black w-full flex justify-between items-center"
          >
            Marca
            {openMarca ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {openMarca && (
            <div className="grid grid-cols-2 gap-2">
              {marcas.map((marca) => (
                <label
                  key={marca}
                  className="flex items-center gap-2 rounded p-2 cursor-pointer text-[#8F108D] hover:bg-[#8F108D] hover:text-white transition"
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
          )}
        </div>
      )}

      {/* FILTRO DESKTOP (desde 1024px) */}
      <div className="hidden lg:flex flex-col text-center  md:text-base 2xl:text-xl border-5 border-[#8F108D] p-6 rounded-md">

        {/* SUBCATEGORÍAS */}
        <div>
          <h3 className="font-bold p-3 bg-[#8F108D] text-white  rounded-md 2xl:text-xl">Subcategorías:</h3>
          <div className="flex flex-col">
            {subcategorias.map((sub) => (
              <button
                key={sub}
                onClick={() => onSelectSubcategoria(sub as SubcategoriaProducto)}
                className={`py-3 rounded-md ${
                  sub === subcategoriaActual
                    ? "bg-[#D9D9D9] text-black"
                    : "bg-white text-[#8F108D] border-[#8F108D]"
                } hover:bg-[#8F108D] hover:text-white transition`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* KG DESKTOP */}
       {kgs.length > 0 && (
  <div className="mt-4">
    <h3 className="font-bold mb-3 p-3 bg-[#8F108D] text-white  rounded-md 2xl:text-xl">
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
)}

        {/* MARCAS DESKTOP */}
        <div className="mt-4">
          <h3 className="font-bold mb-3 p-3 bg-[#8F108D] text-white  rounded-md 2xl:text-xl ">
            Marca:
          </h3>

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
    </>
  );
}
