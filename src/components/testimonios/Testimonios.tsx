import './testimonios.css'

export interface Testimonio {
  imagenbackgroud: string;
  imagen: string;
  parrafo: string;
}

function TestimonioLista({ testimonios }: { testimonios: Testimonio[] }) {
  return (
    <section className="py-10">
      <h3 className="text-center text-2xl md:text-3xl font-bold mb-6 2xl:mb-10 uppercase">
        Testimonios
      </h3>

      <div className="grid grid-cols-1 xs:grid-cols-1  md:grid-cols-3 lg:grid-cols-3
       xl:grid-cols-3 gap-1 xs:gap-1 sm:gap-1 md:gap-5 lg:gap-6 2xl:gap-8 px-4 lg:max-w-7xl mx-auto">
        {testimonios.map((testimonio, index) => (
          <article key={index} className="relative rounded-lg ">
            {/* contenedor-superpuesto */}
            <div className="relative w-full md:h-72 h-70 sm:h-72 lg:h-70 xl:h-80">
              {/* Imagen de fondo */}
              <img
                src={testimonio.imagenbackgroud}
                alt="Fondo"
                className="absolute inset-0
                w-[100%] h-[60%]
                 sm:w-full sm:h-[100%]
                 xs:h-[70%] xs:w-full
                 md:h-[70%] md:w-full
                 lg:h-[70%]  lg:w-full 
                 xl:h-[80%] object-cover z-0"
              />

              {/* Imagen de testimonio, atrás de todo */}
             <img
             src={testimonio.imagen}
             alt="Testimonio"
             className=" absolute top-0 left-1/2 z-[-1] 
               w-[50%] h-[55%]
              xs:w-[50%] xs:h-[63%]       
              sm:w-[60%] sm:h-[100%]   
              md:w-1/2  md:h-[60%]
               lg:w-1/2 lg:h-[65%] 
               xl:w-1/2 xl:h-[75%]  
                
               "
/>

              {/* Texto */}
              <p className="absolute text-white font-bold text-center z-20  w-1/2
              text-[10px] top-8 lesft-2
              xs:top-10 xs:left-3 xs:text-[10px]
               sm:top-10 sm:left-3 sm:text-[10px]
               md:top-6 md:left-2 md:text-[10px]
               lg:top-6 lg:left-2 lg:text-xs
               xl:top-8 xl:left-2 xl:text-sm
               2xl:top-6 2xl:left-2 2xl:text-base

              ">
                {testimonio.parrafo}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TestimonioLista;