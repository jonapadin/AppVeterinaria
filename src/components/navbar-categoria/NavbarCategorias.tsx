import { useState } from "react";
import { Link } from "react-router-dom";

interface CategoriaNavProps {
  onSelectSubcategoria: (subcategoria: string) => void;
  categoriaActual: "Perro" | "Gato" | "Aves" | "Exóticos";
}

function CategoriaNav({ onSelectSubcategoria, categoriaActual }: CategoriaNavProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const categorias = [
    {
      nombre: "Perro",
      ruta: "/productosPerro",
      subcategorias: ["Alimento", "Accesorios", "Higiene y Estética", "Salud"],
    },
    {
      nombre: "Gato",
      ruta: "/productosGato",
      subcategorias: ["Alimento", "Accesorios", "Higiene y Estética", "Salud"],
    },
    {
      nombre: "Aves",
      ruta: "/productosAves",
      subcategorias: ["Alimento", "Accesorios", "Higiene y Estética", "Salud"],
    },
    {
      nombre: "Exóticos",
      ruta: "/productosExoticos",
      subcategorias: ["Alimento", "Accesorios", "Higiene y Estética", "Salud"],
    },
  ];

  const handleToggle = (nombre: string) => {
    if (nombre === categoriaActual) {
      setOpenMenu(openMenu === nombre ? null : nombre);
    }
  };

  return (
    <nav className="bg-[#8F108D] text-white -mt-2 sm:px-4 md:px-6 lg:px-10 py-3 flex flex-wrap justify-center gap-2 font-sans relative z-50">
      {categorias.map((cat) => (
        <div key={cat.nombre} className="relative">
          {/* Si la categoría es la actual, se puede desplegar subcategorías */}
          {cat.nombre === categoriaActual ? (
            <button
              onClick={() => handleToggle(cat.nombre)}
              className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl ${
                openMenu === cat.nombre ? "bg-white text-[#8F108D]" : ""
              }`}
            >
              {cat.nombre}
            </button>
          ) : (
            // Si es otra categoría, lleva a su propia página
            <Link
              to={cat.ruta}
              className="flex items-center gap-1 px-3 py-2 rounded-md transition-colors text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl hover:bg-white hover:text-[#8F108D]"
            >
              {cat.nombre}
            </Link>
          )}

          {/* Subcategorías solo visibles en la página actual */}
          {openMenu === cat.nombre && cat.nombre === categoriaActual && (
            <div className="absolute left-0 mt-2 w-48 bg-white text-[#8F108D] rounded-md shadow-lg">
              {cat.subcategorias.map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    onSelectSubcategoria(sub);
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#f4e4f5] transition-colors text-xs sm:text-base"
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export default CategoriaNav;
