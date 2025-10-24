// Services.tsx
import React from "react";

// Definimos la interfaz para las props del ServiceCard
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
const ServiceCard: React.FC<Service> = ({ title, description, imgVet, imgDec, altVet, altDec }) => (
  <article className=" h-[420px]  md:w-[60%] lg:h-[480px] lg:w-full mb-4 bg-white rounded-xl overflow-hidden relative shadow-lg shadow-gray-600/80">
    <div className="">
      <img className="relative top-0 left-0 h-full w-full lg:-top-4 z-20 boto" src={imgDec} alt={altDec} />
      <h2 className="sub-titulo-servicio absolute z-30 top-75 left-[50%] w-full text-center text-white -translate-x-1/2 text-xl font-semibold ">{title}</h2>
      <img className=" absolute top-6 left-[50%] -translate-x-1/2 mt-4 object-contain w-[200px] lg:w-[70%] lg:h-[60%] lg:-top-6 " src={imgVet} alt={altVet} />
    </div>
    <div className="p-4 lg:py-6 absolute -bottom-3 bg-[#8f108d] z-40">
      <p className="text-white">{description}</p>
    </div>
  </article>
);

// Componente principal
const Services: React.FC = () => (
  <main> 
    <section className="contenedor-servicios py-[120px] px-4 mt-16 lg:w-[80%] lg:mx-auto">
      <h2 className="titulo-servicios text-center text-3xl font-bold mb-8">SERVICIOS</h2>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 md:items-center justify-items-center ">
        {servicesData.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </section>
  </main>
);

export default Services;
