// Importa los iconos de lucide-react que usaremos
import { User, Mail, Calendar, Lock } from 'lucide-react';

export default function RegistroForm() {
  return (
    // Contenedor principal de toda la página, con el mismo fondo degradado del login
    <div className="top-16 relative flex min-h-screen w-full items-center justify-center 
                    bg-gradient-to-br from-purple-100 via-white to-purple-50 p-4">
      
      {/* Botón de volver */}
      {/* <button className="absolute top-8 left-8 text-purple-600 hover:text-purple-800 transition-colors">
        <ArrowLeft size={24} />
      </button> */}

      {/* Tarjeta de Registro */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl md:p-10">
        
        {/* Encabezado */}
        <div className="mb-6 text-left">
          <h1 className="text-3xl font-bold text-gray-800">Crea tu Cuenta</h1>
          <p className="mt-2 text-gray-500">Completa tus datos para unirte.</p>
        </div>

        {/* Formulario de Registro */}
        <form className="space-y-4"> {/* Reducido el espacio para más campos */}
          
          {/* Campo Nombres Completos*/}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
              <User size={20} />
            </span>
            <input
              type="text"
              placeholder="Nombres"
              className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
            {/* Campo Apellidos*/}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
              <User size={20} />
            </span>
            <input
              type="text"
              placeholder="Apellidos"
              className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Campo Correo Electrónico */}
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

          {/* Campo Fecha de Nacimiento (equivalente a Edad, pero más estándar) */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
              <Calendar size={20} />
            </span>
            <input
              type="date"
              placeholder="Fecha de nacimiento" // Puedes cambiar a type="text" y añadir JS para máscara si prefieres "Edad"
              className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4
                         focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-500"
              // Para que el placeholder no se oculte completamente al poner el tipo date,
              // o para tener un placeholder personalizado antes de seleccionar fecha,
              // podrías usar JavaScript o cambiar a type="text" y manejar la lógica de fecha.
            />
          </div>

          {/* Campo Clave */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
              <Lock size={20} />
            </span>
            <input
              type="password"
              placeholder="Clave"
              className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Campo Repetir Clave */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
              <Lock size={20} />
            </span>
            <input
              type="password"
              placeholder="Repetir Clave"
              className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Botón de Registrar (Principal) */}
          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-[#8F108D] py-3
                       font-semibold text-white shadow-lg transition-all
                      hover:bg-[#790e77] hover:shadow-xl"
          >
            REGISTRAR
          </button>
        </form>

        {/* Mensaje de Términos y Condiciones */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Al registrarte, aceptas nuestros{' '}
          <a href="#" className="text-purple-600 hover:underline">
            Términos y Condiciones
          </a>{' '}
          y la{' '}
          <a href="#" className="text-purple-600 hover:underline">
            Política de Privacidad
          </a>
          .
        </p>

      </div>
    </div>
  );
}