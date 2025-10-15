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
    imgVet: "public/assets/img/veterinario1.png",
    imgDec: "public/assets/img/decoracionCard.png",
    altVet: "veterinario",
    altDec: "decoración",
  },
  {
    title: "Administración de Turnos y Consultas",
    description:
      "Agenda turnos fácilmente desde un calendario interactivo. Elige fecha, hora y ubicación. Veterinarios asignados según especialidad. Recibe notificaciones y chatea de forma segura.",
    imgVet: "public/assets/img/veterinario2.png",
    imgDec: "public/assets/img/decoracionCard.png",
    altVet: "veterinario",
    altDec: "decoración",
  },
  {
    title: "Control de Medicación y Tratamientos",
    description:
      "Registra medicamentos por paciente y lleva control de tratamientos. Recibe alertas de vacunas o dosis futuras. Gestiona insumos médicos con un inventario básico y eficiente.",
    imgVet: "public/assets/img/veterinariaperro3.png",
    imgDec: "public/assets/img/decoracionCard.png",
    altVet: "veterinario",
    altDec: "decoración",
  },
];

// Componente reutilizable
const ServiceCard: React.FC<Service> = ({ title, description, imgVet, imgDec, altVet, altDec }) => (
  <article className="card mb-4 shadow-sm bg-white rounded-xl overflow-hidden">
    <div className="relative">
      <img className="absolute top-0 left-0 w-full h-full " src={imgDec} alt={altDec} />
      <h2 className="sub-titulo-servicio relative text-xl font-semibold text-center mt-4 ">{title}</h2>
      <img className="mx-auto mt-4 w-24 h-24 object-contain" src={imgVet} alt={altVet} />
    </div>
    <div className="p-4 bg-[#8f108d]">
      <p className="text-white">{description}</p>
    </div>
  </article>
);

// Componente principal
const Services: React.FC = () => (
  <main> 
    <section className="contenedor-servicios py-[120px] px-4 mt-16 ">
      <h2 className="titulo-servicios text-center text-3xl font-bold mb-8">SERVICIOS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesData.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </section>
  </main>
);

export default Services;
