import { User, Mail, Calendar, Lock, CreditCard, Phone, MapPin, Home } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Tipado para manejar los errores de la API
type AxiosErrorResponse = {
  response?: {
    data?: {
      message?: string;
      // captura errores de validación estructurado
      errors?: { [key: string]: string[] };
    };
    status?: number;
  };
  message?: string;
};

// Tipado para manejar los errores de validación del lado del cliente
type ValidationError = {
  nombre?: string;
  apellido?: string;
  dni?: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: string;
  ciudad?: string;
  direccion?: string;
  contrasena?: string;
  repetirContrasena?: string;
};

export default function RegistroForm() {
  // Estados para los campos de texto y fecha
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');

  // Estados de la foto de perfil eliminados
  const [loading, setLoading] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError>({});

  // Función auxiliar para manejar el cambio de inputs de solo letras (Nombres, Apellidos, Ciudad)
  const handleTextOnlyChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {

    // Expresión regular que solo permite letras, espacios y letras acentuadas
    const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;
    if (regex.test(e.target.value)) {
      setter(e.target.value);
    }
  };

  // Función auxiliar para manejar el cambio de inputs de solo números (DNI, Teléfono)
  const handleNumberOnlyChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Expresión regular que solo permite dígitos
    const regex = /^[0-9]*$/;
    if (regex.test(e.target.value)) {
      setter(e.target.value);
    }
  };

  // Función de validación del lado del cliente
  const validateForm = (): boolean => {
    const errors: ValidationError = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;
    const minLengthName = 3;
    const minLengthAddress = 5;

    // 1. Nombres
    if (nombre.length < minLengthName) {
      errors.nombre = `El nombre debe tener al menos ${minLengthName} caracteres.`;
    } else if (!nameRegex.test(nombre)) {
      errors.nombre = 'El nombre solo puede contener letras y espacios.';
    }
    // 2. Apellidos
    if (apellido.length < minLengthName) {
      errors.apellido = `El apellido debe tener al menos ${minLengthName} caracteres.`;
    } else if (!nameRegex.test(apellido)) {
      errors.apellido = 'El apellido solo puede contener letras y espacios.';
    }
    // 3. DNI
    if (dni.length < 7 || dni.length > 9) {
      errors.dni = 'El DNI debe tener entre 7 y 9 dígitos.';
    } else if (!/^\d+$/.test(dni)) {
      errors.dni = 'El DNI solo debe contener números.';
    }
    // 4. Teléfono
    if (telefono.length < 8) {
      errors.telefono = 'El teléfono debe tener al menos 8 dígitos.';
    } else if (!/^\d+$/.test(telefono)) {
      errors.telefono = 'El teléfono solo debe contener números.';
    }
    // 5. Email
    if (!emailRegex.test(email)) {
      errors.email = 'Introduce un correo electrónico válido.';
    }
    // 6. Fecha de Nacimiento (Mayor de 18 años)
    if (!fechaNacimiento) {
      errors.fechaNacimiento = 'La fecha de nacimiento es requerida.';
    } else {
      const today = new Date();
      const birthDate = new Date(fechaNacimiento);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      const isUnderage = age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));
      if (isUnderage) {
        errors.fechaNacimiento = 'Debes ser mayor de 18 años para registrarte.';
      }
    }
    // 7. Ciudad
    if (ciudad.length < minLengthName) {
      errors.ciudad = `La ciudad debe tener al menos ${minLengthName} caracteres.`;
    } else if (!nameRegex.test(ciudad)) {
      errors.ciudad = 'La ciudad solo puede contener letras y espacios.';
    }
    // 8. Dirección
    if (direccion.length < minLengthAddress) {
      errors.direccion = `La dirección debe tener al menos ${minLengthAddress} caracteres.`;
    }
    // 9. Contraseña y Confirmación
    if (contrasena.length < 8) {
      errors.contrasena = 'La clave debe tener al menos 8 caracteres.';
    }

    if (contrasena !== repetirContrasena) {
      errors.repetirContrasena = 'Las claves no coinciden.';
    }
    // 10. Errores de la foto - Lógica eliminada
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiErrorMsg('');
    setSuccessMsg('');

    if (!validateForm()) {
      return;
    }
    setLoading(true);

    // 1. Construimos el payload de datos con todos los campos obligatorios.
    const formData: Record<string, any> = {
      nombre,
      apellido,
      dni: Number(dni),
      telefono,
      email,
      fecha_nacimiento: fechaNacimiento,
      ciudad,
      direccion,
      contrasena,
      foto_perfil: '',
    };

    try {
      // Endpoint de registro
      await axios.post(
        "http://localhost:4000/api/v1/cliente",
        formData // Usamos el payload dinámico
      );
      setSuccessMsg('¡Registro exitoso! Redirigiendo a Iniciar Sesión...');

      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);

    } catch (error) {
      const err = error as AxiosErrorResponse;
      let message = err.response?.data?.message || err.message || "Error desconocido al registrar.";

      if (err.response?.data?.errors) {
        // Si el backend devuelve una lista de errores de validación, los concatenamos.
        const validationErrorsFromApi = Object.values(err.response.data.errors).flat().join(' ');
        message += ` (Detalle: ${validationErrorsFromApi})`;
      } else if (err.response?.data) {
        // En caso de que el error esté en el objeto 'data' pero no en 'message'
        message += ` (Detalle: ${JSON.stringify(err.response.data)})`;
      }

      setApiErrorMsg(message);

// *** MEJORA: Imprimimos el error completo y el payload enviado para mejor depuración ***
      console.error("Error de Registro (400/500):", err);
      console.warn("Payload enviado:", formData);
    } finally {
      setLoading(false);
      // Limpiar URL de vista previa eliminada
    }
  };
  // Componente auxiliar para mostrar errores
  const ErrorMessage = ({ message }: { message: string | undefined }) => {
    if (!message) return null;
    return <p className="mt-1 text-sm font-medium text-red-600">{message}</p>;
  };
  return (
    // Contenedor principal de toda la página
    <div className="relative flex min-h-screen w-full items-center justify-center
                     from-purple-100 via-white to-purple-50 p-4 py-10 md:py-20">
      {/* Tarjeta de Registro */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl md:p-10">

        {/* Encabezado */}
        <div className="mb-6 text-left">
          <h1 className="text-center text-xl lg:text-4xl font-extrabold text-[#8F108D] my-12">Creá tu Cuenta</h1>
          <p className="mt-2 text-gray-500">Completa tus datos para unirte.</p>
        </div>

        {/* Mensaje de Error/Éxito de API */}
        {apiErrorMsg && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm font-medium text-red-700">
            {apiErrorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm font-medium text-green-700">
            {successMsg}
          </div>
        )}

        {/* Formulario de Registro */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                <User size={20} />
              </span>
              <input
                type="text"
                value={nombre}
                onChange={(e) => handleTextOnlyChange(e, setNombre)}
                onBlur={() => validateForm()}
                placeholder="Nombres (solo letras)"
                className={`w-full rounded-lg border py-3 pl-12 pr-4 focus:outline-none focus:ring-2
                            ${validationErrors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                required
              />
            </div>
            <ErrorMessage message={validationErrors.nombre} />
          </div>

          {/* Campo Apellidos*/}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                <User size={20} />
              </span>
              <input
                type="text"
                value={apellido}
                onChange={(e) => handleTextOnlyChange(e, setApellido)}
                onBlur={() => validateForm()}
                placeholder="Apellidos (solo letras)"
                className={`w-full rounded-lg border py-3 pl-12 pr-4 focus:outline-none focus:ring-2
                            ${validationErrors.apellido ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                required
              />
            </div>
            <ErrorMessage message={validationErrors.apellido} />
          </div>

          {/* Campo DNI */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                <CreditCard size={20} />
              </span>
              <input
                type="text"
                value={dni}
                maxLength={9}
                onChange={(e) => handleNumberOnlyChange(e, setDni)}
                onBlur={() => validateForm()}
                placeholder="DNI / Documento de Identidad (7-9 dígitos)"
                className={`w-full rounded-lg border py-3 pl-12 pr-4 focus:outline-none focus:ring-2
                            ${validationErrors.dni ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                required
              />
            </div>
            <ErrorMessage message={validationErrors.dni} />
          </div>

          {/* Campo Teléfono */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                <Phone size={20} />
              </span>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => handleNumberOnlyChange(e, setTelefono)}
                onBlur={() => validateForm()}
                placeholder="Teléfono (mínimo 8 dígitos)"
                className={`w-full rounded-lg border py-3 pl-12 pr-4 focus:outline-none focus:ring-2
                            ${validationErrors.telefono ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                required
              />
            </div>
            <ErrorMessage message={validationErrors.telefono} />
          </div>

          {/* Campo Correo Electrónico */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                <Mail size={20} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validateForm()}
                placeholder="Correo electrónico"
                className={`w-full rounded-lg border py-3 pl-12 pr-4 focus:outline-none focus:ring-2
                            ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                required
              />
            </div>
            <ErrorMessage message={validationErrors.email} />
          </div>

          {/* Campo Fecha de Nacimiento  */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                <Calendar size={20} />
              </span>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                onBlur={() => validateForm()}
                className={`w-full rounded-lg border py-3 pl-12 pr-4 focus:outline-none focus:ring-2 text-gray-800
                            ${validationErrors.fechaNacimiento ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                required
              />
            </div>
            <ErrorMessage message={validationErrors.fechaNacimiento} />
          </div>

          {/* Campo Ciudad */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                <MapPin size={20} />
              </span>
              <input
                type="text"
                value={ciudad}
                onChange={(e) => handleTextOnlyChange(e, setCiudad)}
                onBlur={() => validateForm()}
                placeholder="Ciudad"
                className={`w-full rounded-lg border py-3 pl-12 pr-4 focus:outline-none focus:ring-2
                            ${validationErrors.ciudad ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                required
              />
            </div>
            <ErrorMessage message={validationErrors.ciudad} />
          </div>

          {/* Campo Dirección */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                <Home size={20} />
              </span>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                onBlur={() => validateForm()}
                placeholder="Dirección (calle y número)"
                className={`w-full rounded-lg border py-3 pl-12 pr-4 focus:outline-none focus:ring-2
                            ${validationErrors.direccion ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                required
              />
            </div>
            <ErrorMessage message={validationErrors.direccion} />
          </div>

          {/* Campo Clave */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                <Lock size={20} />
              </span>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                onBlur={() => validateForm()}
                placeholder="Clave (mínimo 8 caracteres)"
                className={`w-full rounded-lg border py-3 pl-12 pr-4 focus:outline-none focus:ring-2
                            ${validationErrors.contrasena ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                required
              />
            </div>
            <ErrorMessage message={validationErrors.contrasena} />
          </div>

          {/* Campo Repetir Clave */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                <Lock size={20} />
              </span>
              <input
                type="password"
                value={repetirContrasena}
                onChange={(e) => setRepetirContrasena(e.target.value)}
                onBlur={() => validateForm()}
                placeholder="Repetir Clave"
                className={`w-full rounded-lg border py-3 pl-12 pr-4 focus:outline-none focus:ring-2
                            ${validationErrors.repetirContrasena ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                required
              />
            </div>
            <ErrorMessage message={validationErrors.repetirContrasena} />
          </div>

          {/* Botón de Registrar */}
          <button
            type="submit"
            className={`mt-6 w-full rounded-lg py-3 font-semibold text-white shadow-lg transition-all
                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8F108D] hover:bg-[#790e77] hover:shadow-xl'}`}
            disabled={loading}
          >
            {loading ? "Registrando..." : "REGISTRAR"}
          </button>

          <Link to="/login" className='block w-full text-center'>
            <button
              type="button"
              className="w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-600 transition-all
                          hover:bg-gray-100"
            >
              YA TENGO UNA CUENTA
            </button>
          </Link>
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

