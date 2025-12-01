import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Producto } from "../producto/Fetch";
import type { CategoriaProducto } from "../../enums/categoriaProductos";
import type { SubcategoriaProducto } from "../../enums/subCategoriaProductos";



interface FiltroProductosProps {
  productos: Producto[];// - productos: lista completa de productos.
  categoriaActual: CategoriaProducto;
  subcategoriaActual: SubcategoriaProducto;
  onSelectSubcategoria: (subcategoria: SubcategoriaProducto) => void;// función para cambiar de subcategoría.
  onChange: (filtros: { presentaciones: string[]; marcas: string[] }) => void; // avisa al componente padre qué filtros están seleccionados.
}

export default function FiltroProductos({
  productos,
  categoriaActual,
  subcategoriaActual,
  onSelectSubcategoria,
  onChange,
}: FiltroProductosProps) {

  // Estados donde guardo marcas y qué kg eligió el usuario.
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState<string[]>([]);
  const [kgsSeleccionados, setKgsSeleccionados] = useState<string[]>([]);

  // Estados para abrir/cerrar secciones en móvil.
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openKg, setOpenKg] = useState(false);
  const [openMarca, setOpenMarca] = useState(false);

  // Obtengo las subcategorías disponibles de esta categoría.
  const subcategorias = Array.from(
    new Set(
      productos
        .filter((p) => p.categoria === categoriaActual)
        .map((p) => p.subcategoria)
    )
  );

  // Obtengo las marcas disponibles para la categoría y subcategoría actual.
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

  // Obtengo los kg disponibles para la categoría y subcategoría actual.
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
  // Cada vez que el usuario cambia marcas o kgs, aviso al componente padre.
  useEffect(() => {
    onChange({ marcas: marcasSeleccionadas, presentaciones: kgsSeleccionados });
  }, [marcasSeleccionadas, kgsSeleccionados]);

  // Agrega o quita una marca seleccionada.
  const toggleMarca = (marca: string) => {
    setMarcasSeleccionadas((prev) =>
      prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca]
    );
  };
  // Agrega o quita una presentación seleccionada.
  const toggleKg = (kg: string) => {
    setKgsSeleccionados((prev) =>
      prev.includes(kg) ? prev.filter((k) => k !== kg) : [...prev, kg]
    );
  };

  return (
    <>
      {/* BOTÓN PARA ABRIR FILTROS EN MÓVIL */}
      <div className="lg:hidden mt-6 w-full flex justify-center">
        <button
          onClick={() => setOpenMobileMenu(!openMobileMenu)}
          className="flex items-center gap-2 bg-white text-black border-[#8F108D] border-3 px-4 py-2 text-sm rounded-md"
        >
          Filtrar
          {openKg ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* MENU DE FILTROS VISIBLE SOLO EN MÓVIL */}
      {openMobileMenu && (
        <div className="lg:hidden flex flex-col text-center xs:text-sm border-3 border-[#8F108D] p-2 rounded-md">


          {/* SECCIÓN DE KILOS si existen opciones */}
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

        {/* FILTRO PARA PC  */}
      <div className="hidden lg:flex flex-col text-center  md:text-base 2xl:text-xl border-5 border-[#8F108D] p-6 rounded-md">

        {/* SUBCATEGORÍAS */}
        <div>
          <h3 className="font-bold p-3 bg-[#8F108D] text-white  rounded-md 2xl:text-xl">Subcategorías:</h3>
          <div className="flex flex-col">
             {/* Cada botón cambia la subcategoría actual */}
            {subcategorias.map((sub) => (
              <button
                key={sub}
                onClick={() => onSelectSubcategoria(sub as SubcategoriaProducto)}
                className={`py-3 rounded-md ${sub === subcategoriaActual
                    ? "bg-[#D9D9D9] text-black"
                    : "bg-white text-[#8F108D] border-[#8F108D]"
                  } hover:bg-[#8F108D] hover:text-white transition`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* presentacion pc */}
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

        {/* MARCAS pc */}
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
