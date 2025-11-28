import { Lock, Mail } from "lucide-react";

export default function FormRecoveryPass() {
  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center 
                    bg-gradient-to-br from-purple-100 via-white to-purple-50 p-4"
    >

      {/* Tarjeta de Recuperación de Contraseña */}
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl md:p-10 text-center">
        {/* Icono Principal de Candado */}
        <div className="mb-6 flex justify-center">
          <Lock size={60} className="text-fuchsia-700" />
        </div>

        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Recuperar Contraseña
          </h1>
          <p className="mt-2 text-gray-500">
            Ingresa el correo asociado a tu cuenta.
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-6">
          {/* Input Correo Electrónico */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
              <Mail size={20} />
            </span>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#8F108D] py-3
                       font-semibold text-white shadow-lg transition-all
                      hover:bg-[#790e77]  hover:shadow-xl"
          >
            ENVIAR
          </button>
        </form>

        {/* Enlace para volver al login */}
        <p className="mt-6 text-sm text-gray-500">
          ¿Ya recordaste?{" "}
          <a href="#" className="text-purple-600 hover:underline font-medium">
            Volver al Login
          </a>
        </p>
      </div>
    </div>
  );
}

