import {  Lock, Info } from "lucide-react";

export default function ResetPass() {
  return (
    <div
      className=" py-38 relative flex min-h-screen w-full items-center justify-center 
                    bg-gradient-to-br from-purple-100 via-white to-purple-50 p-4"
    >
      {/* Tarjeta de Restablecimiento de Contraseña */}
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl md:p-10">
        {/* Encabezado */}
        <div className="mb-6 text-left">
          <h1 className="text-3xl font-bold text-gray-800">
            Restablece tu Clave
          </h1>
          <p className="mt-2 text-gray-500">
            Ingresa y confirma tu nueva contraseña segura.
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-6">
          {/* Input Nueva Contraseña */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
              <Lock size={20} />
            </span>
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Campo Repetir Contraseña */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
              <Lock size={20} />
            </span>
            <input
              type="password"
              placeholder="Repetir contraseña"
              className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Mensaje de Requisitos de Seguridad */}
          <div className="flex items-start gap-2 text-sm text-gray-500 bg-purple-50 p-3 rounded-lg border border-purple-100">
            <Info size={18} className="text-purple-600 mt-0.5 min-w-[18px]" />
            <span>
              La contraseña debe tener al menos 8 caracteres, incluyendo
              mayúsculas, minúsculas y un número.
            </span>
          </div>

          {/* Botón de Restablecer (Principal) */}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#8F108D] py-3
                       font-semibold text-white shadow-lg transition-all
                        hover:bg-[#790e77] hover:shadow-xl"
          >
            RESTABLECER
          </button>
        </form>

        {/* Enlace para volver al login */}
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya recordaste?{" "}
          <a href="#" className="text-purple-600 hover:underline font-medium">
            Volver al Login
          </a>
        </p>
      </div>
    </div>
  );
}

