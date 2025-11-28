import React from "react";

interface Service {
  title: string;
  description: string;
  imgVet: string;
  imgDec: string;
  altVet: string;
  altDec: string;
}

// Datos de los servicios
const servicesData: Service[] = [
  {
    title: "Gestión de Pacientes y Hospitalización.",
    description:
      "Accede al historial completo de la mascota, incluyendo tratamientos previos y actuales. Adjunta y consulta fácilmente documentos e imágenes médicas relevantes.",
    imgVet: "public/assets/img/veteicono3.png",
    imgDec: "public/assets/img/decoracionCard.png",
    altVet: "veterinario",
    altDec: "decoración",
  },
  {
    title: "Administración de Turnos y Consultas",
    description:
      "Agenda turnos fácilmente desde un calendario interactivo. Elige fecha, hora y ubicación. Veterinarios asignados según especialidad. Recibe notificaciones y chatea de forma segura.",
    imgVet: "public/assets/img/veteicono2.png",
    imgDec: "public/assets/img/decoracionCard.png",
    altVet: "veterinario",
    altDec: "decoración",
  },
  {
    title: "Control de Medicación y Tratamientos",
    description:
      "Registra medicamentos por paciente y lleva control de tratamientos. Recibe alertas de vacunas o dosis futuras. Gestiona insumos médicos con un inventario básico y eficiente.",
    imgVet: "public/assets/img/veteicono4.png",
    imgDec: "public/assets/img/decoracionCard.png",
    altVet: "veterinario",
    altDec: "decoración",
  },
];

// Componente reutilizable
const ServiceCard: React.FC<Service> = ({ title, description, imgVet, imgDec, altVet, altDec }) => {
  // Función para manejar el error de imagen
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; 
    target.src = "https://placehold.co/100x180/ccc/333?text=IMG"; // Placeholder
  };
  
  return (
    <article 
      className="w-full max-w-sm sm:max-w-md rounded-xl overflow-hidden shadow-2xl 
                 transition-all duration-300 hover:shadow-gray-700/80 mb-6 lg:mb-0"
    >
      {/* Sección Superior: Imagen y Decoración */}
      <div className="relative h-60 md:h-72  overflow-hidden flex items-center justify-center p-4">
        
      
        <img 
          className="absolute inset-0 w-full h-full object-cover opacity-80" 
          src={imgDec} 
          alt={altDec} 
          onError={handleError}
        />
        
        <img 
          className="relative z-10 w-3/5 h-auto max-h-[90%] object-contain" 
          src={imgVet} 
          alt={altVet} 
          onError={handleError}
        />
      </div>

      <div className="bg-[#8f108d] text-white p-6 min-h-[170px] flex flex-col justify-start">
        <h2 className="text-xl font-bold mb-3 border-b border-white/30 pb-2">
          {title}
        </h2>
        <p className="text-sm md:text-base">
          {description}
        </p>
      </div>
    </article>
  );
};

// Componente principal
const Services: React.FC = () => (
  <main className="min-h-screen"> 
    <section className="py-16 md:py-24 px-4 mt-16 lg:w-[90%] xl:w-[80%] mx-auto">
      <h2 className="text-center text-4xl font-extrabold text-[#8F108D] mb-12">
        NUESTROS SERVICIOS CLAVES
      </h2>
      
      {/* Contenedor Grid Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 justify-items-center">
        {servicesData.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </section>
  </main>
);

export default Services;