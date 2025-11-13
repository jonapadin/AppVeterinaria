import { Link, Outlet, useLocation } from "react-router-dom";

const bannerPerro = '/assets/img/categoria/bannerPerro.jpg';
const perroImg = '/assets/img/categoria/perro.avif';
const gatoImg = '/assets/img/categoria/gato.avif';
const avesImg = '/assets/img/categoria/aves.avif';
const roedoresImg = '/assets/img/categoria/Erizo.avif';

const categoriasData = [
  { nombre: 'PERRO', imagen: perroImg, colorBorde: 'border-yellow-400', path: 'productosPerro' },
  { nombre: 'GATO', imagen: gatoImg, colorBorde: 'border-blue-400', path: 'productosGato' },
  { nombre: 'AVES', imagen: avesImg, colorBorde: 'border-red-500', path: 'productosAves' },
  { nombre: 'ROEDORES', imagen: roedoresImg, colorBorde: 'border-green-600', path: 'productosExoticos' },
];

const Categorias = () => {
  const location = useLocation();
  const isBaseRoute = location.pathname === "/categoria";

  return (
    <section className="bg-white">
      {isBaseRoute ? (
        <>
          {/* Banner Superior */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-100 to-green-100">
            <img
              src={bannerPerro}
              alt="Varias mascotas: perros, gatos y más"
              className="w-full h-[85vh] mt-24 object-cover object-center"
            />
          </div>

          {/* Título de Categorías */}
          <div className="flex justify-center mt-0 mb-12">
            <h2 className="text-6xl font-bold text-gray-800 border-b-4 border-gray-300 pb-1 px-4">
              Categorías
            </h2>
          </div>

          {/* Contenedor de las Categorías */}
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {categoriasData.map((categoria) => (
                <Link
                  key={categoria.nombre}
                  to={`/categoria/${categoria.path}`}
                  className="group flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  <div
                    className={`relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 ${categoria.colorBorde} shadow-xl transform transition duration-300 group-hover:shadow-2xl`}
                  >
                    <img
                      src={categoria.imagen}
                      alt={`Categoría: ${categoria.nombre}`}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 flex items-end justify-center duration-300 group-hover:bg-opacity-10">
                      <span className="text-white text-xl font-extrabold mb-4 tracking-wider">
                        {categoria.nombre}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-24">
          {/* Mostrar solo el contenido hijo (por ejemplo ProductDogPage) */}
          <Outlet />
        </div>
      )}
    </section>
  );
};

export default Categorias;
