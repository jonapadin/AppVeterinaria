import React from 'react';

function Hero() {
  return (
    <section className="relative h-screen flex items-start justify-start overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src="../../assets/img/banner-inicio.webp"
        alt="banner-inicio"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />


      {/* Contenedor de texto */}
      <div
        className="lg:block lg:absolute top-0 lg:bottom-0 lg:right-0 lg: bg-white/20 lg:z-0 lg:w-1/3  lg:top-1/3 lg:transform lg:-translate-y-1/2 lg:max-w-lg lg:text-center lg:pl-8
         sm:relative sm:m-4 sm:mt-16  sm:max-w-md  sm:text-left sm:pt-4
          md:m-12 md:mt-24 md:max-w-lg"
      >
     
        <div className="relative z-10">
          <p
            className="text-fuchsia-800 Open sans font-semibold text-base 
sm:text-sm md:text-xl lg:text-4xl lg:text-left leading-relaxed mb-6 drop-shadow-md"
          >
            Somos una clínica comprometida con tu bienestar. Ofrecemos atención médica de
            calidad, con un equipo profesional y cercano, enfocados en cuidar tu salud y la de tu familia.
          </p>

   
          <div className="flex justify-start lg:justify-center">
            <button
              className="bg-white border-2 border-fuchsia-600 text-fuchsia-700 font-semibold px-4 py-2 rounded-lg
                          hover:bg-fuchsia-600 hover:text-white transition
                          md:px-8 md:py-4 md:text-lg
                          lg:px-10 lg:py-5 lg:text-xl"
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
