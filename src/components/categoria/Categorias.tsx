import { Link, Outlet, useLocation } from "react-router-dom";

const bannerPerro = "/assets/img/categoria/bannerPerro.jpg";
const perroImg = "/assets/img/categoria/perro.avif";
const gatoImg = "/assets/img/categoria/gato.avif";
const avesImg = "/assets/img/categoria/aves.avif";
const roedoresImg = "/assets/img/categoria/Erizo.avif";

const categoriasData = [
  { nombre: "PERRO", imagen: perroImg, colorBorde: "border-yellow-400", path: "productosPerro" },
  { nombre: "GATO", imagen: gatoImg, colorBorde: "border-blue-400", path: "productosGato" },
  { nombre: "AVES", imagen: avesImg, colorBorde: "border-red-500", path: "productosAves" },
  { nombre: "ROEDORES", imagen: roedoresImg, colorBorde: "border-green-600", path: "productosExoticos" },
];

const Categorias = () => {
  const location = useLocation();
  const isBaseRoute = location.pathname === "/categoria";

  return (
    <section className="bg-white">
      {isBaseRoute ? (
        <>
          {/* Banner totalmente responsive */}
          <div className="relative mt-20">
            <img
              src={bannerPerro}
              alt="Varias mascotas"
              className="
                w-full object-cover object-center
                h-[40vh]
                sm:h-[50vh]
                md:h-[60vh]
                lg:h-[75vh]
                xl:h-[85vh]
              "
            />
          </div>

          {/* Título */}
          <div className="text-center my-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800">
              Categorías
            </h2>
            <div className="w-20 h-1 bg-gray-300 mx-auto mt-3"></div>
          </div>

          {/* Lista de categorías RESPONSIVA */}
          <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="
              grid 
              grid-cols-2 
              sm:grid-cols-2 
              md:grid-cols-3 
              lg:grid-cols-4 
              gap-10 
              place-items-center
            ">
              {categoriasData.map((categoria) => (
                <Link
                  key={categoria.nombre}
                  to={`/categoria/${categoria.path}`}
                  className="group text-center cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  <div
                    className={`
                      relative
                      rounded-full overflow-hidden border-4 shadow-xl 
                      ${categoria.colorBorde}
                      transition-all duration-300
                    
                      w-28 h-28      /* móvil */
                      sm:w-32 sm:h-32
                      md:w-40 md:h-40
                      lg:w-48 lg:h-48
                      xl:w-56 xl:h-56
                    `}
                  >
                    <img
                      src={categoria.imagen}
                      alt={categoria.nombre}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <p className="
                    mt-4 
                    text-lg 
                    sm:text-xl 
                    md:text-2xl 
                    font-bold 
                    tracking-wider 
                    text-gray-700 
                    group-hover:text-black
                  ">
                    {categoria.nombre}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-24 px-4">
          <Outlet />
        </div>
      )}
    </section>
  );
};

export default Categorias;
