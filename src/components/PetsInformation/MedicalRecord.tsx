import { useState } from "react";

// 🐾 Definimos el tipo de mascota
interface Mascota {
  nombre: string;
  especie: "Perro" | "Gato" | "Ave" | string;
  raza: string;
  edad: string;
  peso: string;
  descripcion: string;
}

export default function AcordeonMascotas() {
  // 🐶 Datos iniciales por defecto
  const [mascotas] = useState<Mascota[]>([
    {
      nombre: "Firulais",
      especie: "Perro",
      raza: "Labrador",
      edad: "5 años",
      peso: "25 kg",
      descripcion: "Vacunado, sin alergias conocidas.",
    },
    {
      nombre: "Michi",
      especie: "Gato",
      raza: "Siames",
      edad: "3 años",
      peso: "6 kg",
      descripcion: "Alergia leve al polen.",
    },
    {
      nombre: "Piolín",
      especie: "Ave",
      raza: "Canario",
      edad: "1 año",
      peso: "0.05 kg",
      descripcion: "En excelente estado de salud.",
    },
  ]);

  // Estado para controlar qué acordeón está abierto
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Emoji según especie
  const getEmoji = (especie: string): string => {
    switch (especie) {
      case "Perro":
        return "🐶";
      case "Gato":
        return "🐱";
      case "Ave":
        return "🐦";
      default:
        return "🐾";
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-52 px-4">
       <h2 className="text-center text-xl lg:text-4xl font-extrabold text-[#8F108D] my-12 ">
                    MIS MASCOTAS
                </h2>

      <div className="space-y-3">
        {mascotas.map((mascota, index) => (
          <div
            key={index}
            className="border rounded-lg shadow-sm overflow-hidden bg-white"
          >
            {/* Header */}
            <button
              onClick={() => toggleAccordion(index)}
              className={`w-full flex justify-between items-center px-4 py-3 text-left text-lg font-medium transition-all ${
                activeIndex === index
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <span>
                {getEmoji(mascota.especie)} {mascota.nombre} - {mascota.especie}
              </span>
              <span
                className={`transform transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {/* Contenido con animación */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                activeIndex === index ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="px-4 py-3">
                <ul className="list-none space-y-1 text-gray-700">
                  <li>
                    <strong>Nombre:</strong> {mascota.nombre}
                  </li>
                  <li>
                    <strong>Especie:</strong> {mascota.especie}
                  </li>
                  <li>
                    <strong>Raza:</strong> {mascota.raza}
                  </li>
                  <li>
                    <strong>Edad:</strong> {mascota.edad}
                  </li>
                  <li>
                    <strong>Peso:</strong> {mascota.peso}
                  </li>
                  <li>
                    <strong>Historial médico:</strong> {mascota.descripcion}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}