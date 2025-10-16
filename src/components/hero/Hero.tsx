import React from "react";
import ServiceList from "./Servicios";

function Hero() {
  return (
    <>
      {/* Hero con imagen de fondo */}
<section className="relative h-screen w-full overflow-hidden">
  <img
    src="../../assets/img/banner-inicio.webp"
    alt="banner-inicio"
    className="absolute inset-0 w-full h-full object-cover object-center"
  />

  <div
    className="lg:absolute lg:top-0 lg:right-0 lg:bottom-0 lg:w-1/3 
      lg:bg-white/20 lg:z-10
      lg:flex lg:items-center lg:justify-center lg:text-left
    "
  >
    <div className="relative z-10 p-4 sm:p-8 md:p-10 flex flex-col justify-start mt-20 sm:mt-24 md:mt-28 lg:mt-0">
      
      <p
        className="
          text-[#8F108D] 
          text-[4vw] sm:text-[3.5vw] md:text-[2.5vw] lg:text-[2rem] 
          font-sans font-semibold leading-relaxed mb-6
          drop-shadow-md
        "
      >
        Somos una clínica comprometida con tu bienestar. Ofrecemos atención médica de
        calidad, con un equipo profesional y cercano, enfocados en cuidar tu salud y la
        de tu familia.
      </p>

      <div className="flex justify-start lg:justify-center mt-4 sm:mt-6 md:mt-8 lg:mt-6">
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

           {/* --- SERVICIOS --- */}
<ServiceList
  servicios={[
    {
      imagen: "../../assets/icons/maki_doctor (1).svg",
      titulo: "Gestión de Pacientes y Hospitalización",

    },
    {
      imagen: "../../assets/icons/fluent_shifts-activity-24-filled.svg",
      titulo: "Administración de Turnos y Consultas",
     
    },
    {
      imagen: "../../assets/icons/hugeicons_treatment.svg",
      titulo: "Control de Medicación y Tratamientos",
   
    },
    {
      imagen: "../../assets/icons/stash_shop.svg",
      titulo: "Balanceados Varias marcas y variantes",
    
    }
  ]}
/>

      {/* --- TESTIMONIOS --- */}

   <div className="max-w-4xl mx-auto px-10">
  <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
    TESTIMONIOS
  </h2>

  <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-10 ">
    
    {/* Testimonio 1 */}
   <article className="relative bg-white rounded-xl shadow-lg overflow-hidden
  w-full h-auto
  md:h-[250px] md:w-[700px]
  lg:h-[320px] lg:w-[900px]">
  <img
    src="../../assets/img/testimonio1.webp"
    alt="Dueño feliz"
    className="absolute top-0 w-[50%] h-full object-cover z-0 right-0"
  />
  <img
    src="../../assets/img/backgroudtestimonios.webp"
    alt="Foto mascota"
    className="absolute inset-0 w-full h-full object-cover z-0"
  />
  <div className="inset-0 flex z-10">
    <p className="w-[50%] text-white absolute font-lato lg:text-lg md:text-xl pl-4 pt-10">
      Llevé a mi perrita Luna por una revisión y quedé encantada.
      El trato fue súper humano, se nota que aman a los animales.
      Ahora no la llevo a otro lugar. ¡Gracias por cuidarla tanto!
      — María G., dueña de Luna
    </p>
  </div>
</article>

    {/* Testimonio 2 */}
    <article className="relative bg-white rounded-xl overflow-hidden py-10 min-h-[300px] lg:w-[500px]">
      <img
        src="../../assets/img/testimonio2.webp"
        alt="Dueño feliz"
        className="absolute top-0 w-[50%] h-full object-cover z-0 right-0"
      />
      <img
        src="../../assets/img/backgroudtestimonios.webp"
        alt="Foto mascota"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="inset-0 flex z-10">
        <p className="w-[50%] text-white absolute font-lato lg:text-lg md:text-xl pl-4 pt-10">
          Mi conejito se llama Copito. Estaba triste y no comía,
          pero en la veterinaria lo cuidaron mucho. Ahora está feliz otra vez. 
          ¡Gracias por ayudar a Copito! — Santi, 8 años
        </p>
      </div>
    </article>
    
    {/* Testimonio 3 */}
    <article className="relative bg-white rounded-xl shadow-lg overflow-hidden py-10 min-h-[300px] lg:w-[500px] ">
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
      <div className="inset-0 flex z-10">
        <p className="w-[50%] text-white absolute font-lato lg:text-lg md:text-xl pl-4 pt-10">
          Mi perro Max odia ir al veterinario, pero acá entró 
          moviendo la cola. El equipo fue súper paciente y
          profesional. Lo revisaron sin estrés y hasta le 
          dieron una galletita. ¡Mil gracias! — Lucía M., mamá de Max
        </p>
      </div>
    </article>

  </div>
</div>

    </>
  );
}


export default Hero;
