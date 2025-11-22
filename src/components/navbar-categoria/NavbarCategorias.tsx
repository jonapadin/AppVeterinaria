import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import type { Producto } from "../producto/Fetch";

interface NavbarCategoriasProps {
  categoriaActual: "Perro" | "Gato" | "Aves" | "Exóticos";
  productos: Producto[];
  onSelectSubcategoria: (subcategoria: string) => void;
}

function NavbarCategorias({ categoriaActual, productos, onSelectSubcategoria }: NavbarCategoriasProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();

  const subcategorias = Array.from(
    new Set(productos.filter((p) => p.categoria === categoriaActual).map((p) => p.subcategoria))
  );

  const categorias = [
    { nombre: "Perro", path: "/categoria/productosPerro" },
    { nombre: "Gato", path: "/categoria/productosGato" },
    { nombre: "Aves", path: "/categoria/productosAves" },
    { nombre: "Exóticos", path: "/categoria/productosExoticos" },
  ];

  const handleToggle = (nombre: string) => setOpenMenu(openMenu === nombre ? null : nombre);

  return (
    <nav className="w-full bg-[#8F108D] text-white py-2 md:py-3 lg:py-4 flex flex-wrap justify-center gap-1 md:gap-3">
      {categorias.map((cat) => {
        const isActive = location.pathname.startsWith(cat.path);
        return (
          <div key={cat.nombre} className="relative">
            <Link to={cat.path}>
              <button
                onClick={() => handleToggle(cat.nombre)}
                className={`flex items-center gap-1 px-1 py-2 rounded-md transition-colors text-xs sm:text-sm md:text-xl ${
                  isActive ? "bg-white text-[#8F108D]" : "hover:bg-white hover:text-[#8F108D]"
                }`}
              >
                {cat.nombre}
                <ChevronDown size={20} className={`transition-transform duration-300 ${openMenu === cat.nombre ? "rotate-180" : ""}`} />
              </button>
            </Link>

            {openMenu === cat.nombre && (
              <div className="absolute left-0 mt-2 w-48 bg-white text-[#8F108D] rounded-md shadow-lg">
                {subcategorias.map((sub) => (
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
