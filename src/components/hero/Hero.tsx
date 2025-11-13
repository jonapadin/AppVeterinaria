
import ServiceList from "../servicioHero/Servicios";
import TestimonioLista from "../testimonios/Testimonios";

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
    className="md:absolute md:top-0 md:right-0 md:bottom-0 md:w-1/3
      md:bg-white/20 md:z-10 md:flex md:items-center md:justify-center md:text-left
      lg:absolute lg:top-0 lg:right-0 lg:bottom-0 lg:w-1/3
      lg:bg-white/20 lg:z-10
      lg:flex lg:items-center lg:justify-center lg:text-left
    "
  >
    <div className="relative z-10 p-4 sm:p-8 md:p-10 flex flex-col justify-start mt-20 sm:mt-24 md:mt-20 lg:mt-10 xl:mt-10">
      
      <p
        className="
          text-[#8F108D] 
            sm:text-sm
             md:text-base
             lg:text-xl
             xl:text-2xl
          font-sans font-semibold leading-relaxed mb-6
          drop-shadow-md
        "
      >
        Somos una clínica comprometida con tu bienestar. Ofrecemos atención médica de
        calidad, con un equipo profesional y cercano, enfocados en cuidar tu salud y la
        de tu familia.
      </p>

      <div className="flex justify-start md:justify-center sm:mt-2 md:mt-4 lg:mt-6 xl:mt-6">
        <button
          className="
           flex items-center justify-center bg-white border-2 border-[#8F108D] text-[#8F108D] font-sans font-semibold 
            px-4 py-2 rounded-lg
            hover:bg-[#8F108D] hover:text-white transition
            sm:px-6 sm:py-1 sm:text-sm
            md:px-8 md:py-2 md:text-base
            lg:px-6 lg:py-3 lg:text-lg
            xl:px-6 xl:py-4 xl:text-2xl
             w-30 h-10         
             sm:w-32 sm:h-8   
             md:w-36 md:h-10    
             lg:w-40 lg:h-12 
             xl:w-42 xl:h-14
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
 <TestimonioLista
  testimonios={[
    {
      imagenbackgroud: "../../assets/img/backgroudtestimonios.webp",
      imagen: "../../assets/img/testimonio1.webp",
      parrafo: `Llevé a mi perrita Luna por una revisión y quedé encantada.
        El trato fue súper humano, se nota que aman a los animales.
        Ahora no la llevo a otro lugar. ¡Gracias por cuidarla tanto!
        — María G. Dueña de Luna.`,
    },
    {
      imagenbackgroud: "../../assets/img/backgroudtestimonios.webp",
      imagen: "../../assets/img/testimonio44.jpg",
      parrafo: `Mi perrito se llama Tom. Estaba triste y no comía,
        pero en la veterinaria lo cuidaron mucho. Ahora está feliz otra vez. 
        ¡Gracias por ayudar a Tom! — Santi, 8 años`,
    },
    {
      imagenbackgroud: "../../assets/img/backgroudtestimonios.webp",
      imagen: "../../assets/img/testimonio3.webp",
      parrafo: `Mi perro Max odia ir al veterinario, pero acá entró moviendo la cola.
        El equipo fue súper paciente y profesional. Lo revisaron sin estrés y hasta le dieron una galletita.
        ¡Mil gracias! — Lucas M. Papá de Max`,
    },
  ]}
/>

    </>
  );
}


export default Hero;
