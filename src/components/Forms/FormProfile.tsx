import { FaRegUser, FaEnvelope, FaPhone } from "react-icons/fa";

function Formulario() {
  return (
    <form className="max-w-lg mx-auto p-6 my-9 bg-white shadow-lg rounded-lg">
      <div className="flex flex-row items-center mb-6">
        <FaRegUser className="w-6 h-6 text-gray-500" />
        <div className="ml-2">
          <h1 className="text-2xl font-semibold text-gray-700">Perfil del usuario</h1>
          <span className="text-sm text-gray-500">Información personal</span>
        </div>
      </div>

      {/* Nombre */}
      <div className="mb-4">
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <div className="flex items-center mt-2 p-2 border rounded-md">
          <FaRegUser className="w-5 h-5 text-gray-400" />
          <input
            id="nombre"
            type="text"
            placeholder="Tu nombre"
            className="ml-2 flex-1 p-2 border-none focus:outline-none"
          />
        </div>
      </div>

      {/* Correo electrónico */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <div className="flex items-center mt-2 p-2 border rounded-md">
          <FaEnvelope className="w-5 h-5 text-gray-400" />
          <input
            id="email"
            type="email"
            placeholder="Tu correo electrónico"
            className="ml-2 flex-1 p-2 border-none focus:outline-none"
          />
        </div>
      </div>

      {/* Teléfono */}
      <div className="mb-6">
        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
          Teléfono
        </label>
        <div className="flex items-center mt-2 p-2 border rounded-md">
          <FaPhone className="w-5 h-5 text-gray-400" />
          <input
            id="telefono"
            type="tel"
            placeholder="Tu teléfono"
            className="ml-2 flex-1 p-2 border-none focus:outline-none"
          />
        </div>
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-[#8F108D] text-white font-semibold rounded-md hover:bg-[#570c56] focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Guardar Cambios
      </button>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Seguridad</h2>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Cambiar contraseña
          </button>
          <button
            type="button"
            className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </form>
  );
}

export default Formulario;