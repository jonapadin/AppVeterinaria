// Importa los iconos que usaremos
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export default function InicioSesion() {
  return (
    // Contenedor principal de toda la página
    <div className="top-16 relative flex min-h-screen w-full items-center justify-center 
                    bg-gradient-to-br from-purple-100 via-white to-purple-50 p-4">
      
      {/* Botón de volver (opcional) */}
      <button className="absolute top-8 left-8 text-purple-600 hover:text-purple-800 transition-colors">
        <ArrowLeft size={24} />
      </button>

      {/* Tarjeta de Inicio de Sesión */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl md:p-10">
        
        {/* Encabezado */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">¡Hola de Neevo!</h1>
          <p className="mt-2 text-gray-500">Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <form className="space-y-5">
          
          {/* Campo de Correo */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
              <Mail size={20} />
            </span>
            <input
              type="email"
              placeholder="correo@correo.com"
              className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
              <Lock size={20} />
            </span>
            <input
              type="password"
              placeholder="**********"
              className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Enlace de Olvidaste Contraseña */}
          <div className="text-right">
            <a href="#" className="text-sm text-purple-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón de Ingresar (Principal) */}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#8F108D] py-3
                       font-semibold text-white shadow-lg transition-all
                    hover:bg-[#790e77] hover:shadow-xl"
          >
            INGRESAR
          </button>

          {/* Botón de Registrarse (Secundario) */}
          <button
            type="button"
            className="w-full rounded-lg border border-gray-300 py-3
                       font-semibold text-gray-600 transition-all
                       hover:bg-gray-100"
          >
            REGISTRARSE
          </button>
        </form>

        {/* Divisor "o" */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-400">o</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Botones de Redes Sociales */}
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Botón Google */}
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg
                       border border-gray-300 py-2.5 text-gray-700
                       transition-all hover:bg-gray-100"
          >
            <FcGoogle size={22} />
            <span className="font-medium">Ingresar con Google</span>
          </button>
          
          {/* Botón Facebook */}
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg
                       border border-gray-300 py-2.5 text-gray-700
                       transition-all hover:bg-gray-100"
          >
            <FaFacebook size={22} className="text-blue-600" />
            <span className="font-medium">Ingresar con Facebook</span>
          </button>
        </div>

      </div>
    </div>
  );
}