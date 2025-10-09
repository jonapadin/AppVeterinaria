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
            <p className="text-black sm:text-sm lg:text-lg font-semibold">
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
            <p className="text-black lg:text-lg  sm:text-sm  font-semibold">
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
            <p className="text-black lg:text-lg  sm:text-sm  font-semibold">
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
            <p className="text-black lg:text-lg  sm:text-sm  font-semibold">
              Balanceados Contamos con varias marcas y variantes
            </p>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIOS --- */}
<div className="max-w-4xl mx-auto grid grid-cols-1 gap-10 px-4">
  {/* Testimonio 1 */}
  <article className="relative bg-white rounded-xl shadow-lg overflow-hidden h-64">
    <img
      src="../../assets/img/testimonio1.webp"
      alt="Dueño feliz"
      className="absolute top-0 w-[60%] h-full object-cover z-0 right-0"
    />
    <img
      src="../../assets/img/backgroudtestimonios.webp"
      alt="Foto mascota"
      className="absolute inset-0 w-full h-full object-cover z-0"
    />
    {/* Texto centrado sobre la imagen */}
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <p className="text-white font-lato text-center text-lg md:text-xl px-4">
       Llevé a mi perrita Luna por una revisión y quedé encantada.
        El trato fue súper humano, se nota que aman a los animales.
         Ahora no la llevo a otro lugar. ¡Gracias por cuidarla tanto!
          — María G., dueña de Luna
      </p>
    </div>
  </article>

  {/* Testimonio 2 */}
  <article className="relative bg-white rounded-xl overflow-hidden h-64">
    <img
      src="../../assets/img/testimonio2.webp"
      alt="Dueño feliz"
      className="absolute top-0 w-[60%] h-full object-cover z-0 right-0"
    />
    <img
      src="../../assets/img/backgroudtestimonios.webp"
      alt="Foto mascota"
      className="absolute inset-0 w-full h-full object-cover z-0"
    />
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <p className="text-white font-lato text-center text-lg md:text-xl px-4">
        Mi conejito se llama Copito. Estaba triste y no comía,
         pero en la veterinaria lo cuidaron mucho. Ahora está feliz otra vez. 
         ¡Gracias por ayudar a Copito!"— Santi, 8 años
      </p>
    </div>
  </article>

  {/* Testimonio 3 */}
  <article className="relative bg-white rounded-xl shadow-lg overflow-hidden h-64">
    <img
      src="../../assets/img/testimonio33.webp"
      alt="Dueño feliz"
      className="absolute top-0 w-[50%] h-full object-cover z-0 right-0"
    />
    <img
      src="../../assets/img/backgroudtestimonios.webp"
      alt="Foto mascota"
      className="absolute inset-0 w-full h-full object-cover z-0"
    />
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <p className="text-white font-lato text-center text-lg md:text-xl px-4">
      Mi perro Max odia ir al veterinario,  pero aca entro 
      moviendo la cola. El  esquipo fue super paciente y
      profecional. lo revisaron sin estres y hasta le 
      dieron una galletita¡mil gracias!
     -Lucia M, mama de max
      </p>
    </div>
  </article>
</div>

    </>
  );
}


export default Hero;
