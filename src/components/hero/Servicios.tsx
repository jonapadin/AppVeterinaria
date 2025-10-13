
interface Service {
  imagen: string;
  titulo: string;
 
}


function ServiceList({ servicios }: { servicios: Service[] }) {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 py-20">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
        SERVICIOS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {servicios.map((servicio, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="bg-[#e4dddd] p-6 rounded-full mb-4">
              <img
                src={servicio.imagen}
                alt={servicio.titulo}
                className="w-12 h-12 mx-auto"
              />
            </div>
            <p className="text-black lg:text-lg sm:text-sm font-semibold">
              {servicio.titulo}
            </p>
        
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServiceList;
