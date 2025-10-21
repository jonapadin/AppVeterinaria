
export interface Testimonio {
  imagenbackgroud: string;
  imagen: string;
  parrafo: string;
}

function TestimonioLista({ testimonios }: { testimonios: Testimonio[] }) {
  return (
    <section className="py-24 ">
      <h3 className="text-center text-2xl md:text-3xl font-bold mb-10">
        Testimonios
      </h3>

      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3 px-4 lg:max-w-7xl  mx-auto text-xs
    
      ">
        {testimonios.map((testimonio, index) => (
          <article
            key={index}
            className="relative rounded-lg overflow-hidden max-w-md  w-full "
          >
            <div className="relative h-56">
              <div className="relative lg:w-full lg:h-[80%]  mb-4 z-10">
              <img
                src={testimonio.imagenbackgroud}
                alt={`img brackground `}
              />
            </div>
              <img
                src={testimonio.imagen}
                alt={`Foto del testimonio `}
                className="absolute right-0 top-0 lg:h-[80%] sm:h[20%]
                lg:w-1/2  rounded-lg z-0
                "
              />

             
              <p className="absolute top-3 text-white left-2 z-20 p-2 w-1/2 font-bold">
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
