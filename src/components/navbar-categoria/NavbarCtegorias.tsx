import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

function CategoriaNav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const categorias = [
    {
      nombre: "Perro",
      ruta: "/productosPerro",
      subcategorias: [
        { nombre: "Alimento", ruta: "alimento" },
        { nombre: "Accesorios", ruta: "accesorios" },
        { nombre: "Higiene y Estética", ruta: "higiene-estetica" },
        { nombre: "Salud", ruta: "salud" },
      ],
    },
    {
      nombre: "Gato",
      ruta: "/productosGato",
      subcategorias: [
        { nombre: "Alimento", ruta: "alimento" },
        { nombre: "Accesorios", ruta: "accesorios" },
        { nombre: "Higiene y Estética", ruta: "higiene-estetica" },
        { nombre: "Salud", ruta: "salud" },
      ],
    },
    {
      nombre: "Aves",
      ruta: "/productosAve",
      subcategorias: [
        { nombre: "Alimento", ruta: "alimento" },
        { nombre: "Accesorios", ruta: "accesorios" },
{ nombre: "Higiene y Estética", ruta: "higiene-estetica" },
        { nombre: "Salud", ruta: "salud" },
      ],
    },
    {
      nombre: "Exóticos",
      ruta: "/productosExotico",
      subcategorias: [
        { nombre: "Alimento", ruta: "alimento" },
        { nombre: "Accesorios", ruta: "accesorios" },
        { nombre: "Higiene y Estética", ruta: "higiene-estetica" },
        { nombre: "Salud", ruta: "salud" },
      ],
    },
  ];

  const handleToggle = (nombre: string) => {
    setOpenMenu(openMenu === nombre ? null : nombre);
  };

  return (
    <nav className="bg-[#8F108D] text-white -mt-2 sm:px-4 md:px-6 lg:px-10 py-3 flex flex-wrap justify-center gap-2 font-sans relative z-50">
      {categorias.map((cat) => (
        <div key={cat.nombre} className="relative">
          {/* Botón principal */}
          <button
            onClick={() => handleToggle(cat.nombre)}
            className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl ${
              openMenu === cat.nombre ? "bg-white text-[#8F108D]" : ""
            }`}
          >
            {cat.nombre}
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                openMenu === cat.nombre ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Submenú desplegable */}
          {openMenu === cat.nombre && (
            <div className="absolute left-0 mt-2 w-48 bg-white text-[#8F108D] rounded-md shadow-lg">
              {cat.subcategorias.map((sub) => (
                <Link
                  key={sub.nombre}
                  to={`${cat.ruta}/${sub.ruta}`}
                  onClick={() => setOpenMenu(null)}
                  className="block px-4 py-2 hover:bg-[#f4e4f5] transition-colors text-xs sm:text-base"
                >
                  {sub.nombre}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export default CategoriaNav;
