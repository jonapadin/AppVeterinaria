import React from "react";

function Hero() {
  return (
    <>
      {/* Hero con imagen de fondo */}
      <section className="relative min-h-screen h-screen w-full overflow-hidden">
        <img
          src="../../assets/img/banner-inicio.webp"
          alt="banner-inicio"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div
          className="
            lg:absolute lg:top-0 lg:right-0 lg:bottom-0 lg:w-1/3 
            lg:bg-white/20 lg:z-10
            lg:flex lg:items-center lg:justify-center lg:text-left
          "
        >
          <div className="relative z-10 p-4 sm:p-8 md:p-10">
            <p
              className="
              text-[#8F108D] 
              text-[4vw] sm:text-[3.5vw] md:text-[2.5vw] lg:text-[2rem] 
              font-sans font-semibold leading-relaxed mb-6 drop-shadow-md
            "
            >
              Somos una clínica comprometida con tu bienestar. Ofrecemos atención médica de
              calidad, con un equipo profesional y cercano, enfocados en cuidar tu salud y la
              de tu familia.
            </p>

            <div className="flex justify-start lg:justify-center">
              <button
                className="
                bg-white border-2 border-[#8F108D] text-[#8F108D] font-sans font-semibold 
                px-4 py-2 rounded-lg
                hover:bg-[#8F108D] hover:text-white transition
                sm:px-6 sm:py-3 sm:text-base
                md:px-8 md:py-4 md:text-lg
                lg:px-6 lg:py-3 lg:text-3xl
              "
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Servicios (fuera del Hero) */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          SERVICIOS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {/* Servicio 1 */}
          <div className="flex flex-col items-center">
            <div className="bg-[#D9D9D9] p-6 rounded-full mb-4">
              <img
                src="../../assets/icons/maki_doctor (1).svg"
                alt="icon-doctor"
                className="w-12 h-12 mx-auto"
              />
            </div>
            <p className="text-black text-lg font-semibold">
              Gestión de Pacientes  y Hospitalización.
            </p>
          </div>

          {/* Servicio 2 */}
          <div className="flex flex-col items-center">
            <div className="bg-[#D9D9D9] p-6 rounded-full mb-4">
              <img
                src="../../assets/icons/fluent_shifts-activity-24-filled.svg"
                alt="icon-doctor"
                className="w-12 h-12 mx-auto"
              />
            </div>
            <p className="text-black text-lg  font-semibold">
              Administración de Turnos y Consultas.
            </p>
          </div>

          {/* Servicio 3 */}
          <div className="flex flex-col items-center">
            <div className="bg-[#D9D9D9] p-6 rounded-full mb-4">
              <img
                src="../../assets/icons/hugeicons_treatment.svg"
                alt="icon-doctor"
                className="w-12 h-12 mx-auto"
              />
            </div>
            <p className="text-black text-lg font-semibold">
              Control de Medicación y Tratamientos.</p>
          </div>

          {/* Servicio 4 */}
          <div className="flex flex-col items-center">
            <div className="bg-[#D9D9D9] p-6 rounded-full mb-4">
              <img
                src="../../assets/icons/stash_shop.svg"
                alt="icon-doctor"
                className="w-12 h-12 mx-auto"
              />
            </div>
            <p className="text-black text-lg  font-semibold">
              Balanceados Contamos con varias marcas y variantes
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
