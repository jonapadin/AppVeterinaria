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
      <div className="relative z-10 m-4 mt-16 max-w-md text-left
                      md:m-12 md:mt-24 md:max-w-lg
                      lg:m-16 lg:mt-32 lg:max-w-none lg:w-1/2 lg:pl-16">
        <p className="text-fuchsia-800 font-opensans font-semibold text-base
                      md:text-xl lg:text-2xl leading-relaxed mb-6 drop-shadow-md">
          Somos una clínica comprometida con tu bienestar. Ofrecemos atención médica de
          calidad, con un equipo profesional y cercano, enfocados en cuidar tu salud y la de tu familia.
        </p>

        <button className="bg-white border-2 border-fuchsia-600 text-fuchsia-700 font-semibold px-4 py-2 rounded-lg
                           hover:bg-fuchsia-600 hover:text-white transition
                           md:px-8 md:py-4 md:text-lg
                           lg:px-10 lg:py-5 lg:text-xl">
          Registrarse
        </button>
      </div>
    </section>
  );
}

export default Hero;
