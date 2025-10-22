export interface Testimonio {
  imagenbackgroud: string;
  imagen: string;
  parrafo: string;
}

function TestimonioLista({ testimonios }: { testimonios: Testimonio[] }) {
  return (
    <section className="py-15">
      <h3 className="text-center text-2xl md:text-3xl font-bold mb-8 uppercase">
        Testimonios
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3
       :grid-cols-3  gap-6 px-4 lg:max-w-7xl mx-auto">
        {testimonios.map((testimonio, index) => (
          <article key={index} className="relative rounded-lg ">
            {/* contenedor-superpuesto */}
            <div className="relative w-full h-80 md:h-72 sm:h-50 lg:h-70 xl:h-80">
              {/* Imagen de fondo */}
              <img
                src={testimonio.imagenbackgroud}
                alt="Fondo"
                className="absolute inset-0
                 lg:w-full sm:w-[30%] sm:h-[30%]
                 md:h-[70%] md:w-full
                 lg:h-[70%] 
                 xl:h-[80%] object-cover z-0"
              />

              {/* Imagen de testimonio, atrás de todo */}
             <img
             src={testimonio.imagen}
             alt="Testimonio"
             className="absolute top-0  z-[-1]
             sm:w-1/3 sm:h-1/3
              left-[50%] md:w-1/2  md:h-[60%]
               lg:w-1/2 lg:h-[65%] 
               xl:w-1/2 xl:h-[75%]  
               "
/>

            

              {/* Texto */}
              <p className="absolute text-white font-bold text-center z-20  w-1/2
               sm:top-1 sm-left.2 sm:text-xs
               md:top-1  md:left-2 md:text-xs 
               lg:top-6 lg:left-2 lg:text-sm
               xl:top-4 xl:left-4 xl:text-base

  
              
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