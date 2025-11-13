// src/components/navbar-categoria/NavbarCategorias.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface NavbarCategoriasProps {
  categoriaActual: "Perro" | "Gato" | "Aves" | "Exóticos";
  onSelectSubcategoria: (subcategoria: string) => void;
}

function NavbarCategorias({onSelectSubcategoria }: NavbarCategoriasProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();

  const categorias = [
    {
      nombre: "Perro",
      path: "/categoria/productosPerro",
      subcategorias: ["Alimento", "Accesorios", "Higiene y Estética", "Salud"],
    },
    {
      nombre: "Gato",
      path: "/categoria/productosGato",
      subcategorias: ["Alimento", "Accesorios", "Higiene y Estética", "Salud"],
    },
    {
      nombre: "Aves",
      path: "/categoria/productosAves",
      subcategorias: ["Alimento", "Accesorios", "Higiene y Estética", "Salud"],
    },
    {
      nombre: "Exóticos",
      path: "/categoria/productosExoticos",
      subcategorias: ["Alimento", "Accesorios", "Higiene y Estética", "Salud"],
    },
  ];

  const handleToggle = (nombre: string) => {
    setOpenMenu(openMenu === nombre ? null : nombre);
  };

  return (
    <nav className="bg-[#8F108D] text-white py-3 flex flex-wrap justify-center gap-3 relative z-50">
      {categorias.map((cat) => {
        const isActive = location.pathname.startsWith(cat.path);

        return (
          <div key={cat.nombre} className="relative">
            <Link to={cat.path}>
              <button
                onClick={() => handleToggle(cat.nombre)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors text-sm sm:text-lg md:text-xl ${
                  isActive
                    ? "bg-white text-[#8F108D]"
                    : "hover:bg-white hover:text-[#8F108D]"
                }`}
              >
                {cat.nombre}
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    openMenu === cat.nombre ? "rotate-180" : ""
                  }`}
                />
              </button>
            </Link>

            {/* Subcategorías sin navegación, solo cambio de cards */}
            {openMenu === cat.nombre && (
              <div className="absolute left-0 mt-2 w-48 bg-white text-[#8F108D] rounded-md shadow-lg">
                {cat.subcategorias.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      onSelectSubcategoria(sub);
                      setOpenMenu(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#f4e4f5] transition-colors"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default NavbarCategorias;
