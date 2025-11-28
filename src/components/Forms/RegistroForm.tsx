import { User, Mail, Calendar, Lock, CreditCard, Phone, MapPin, Home, Image as ImageIcon } from 'lucide-react';
import { useState, useMemo } from 'react'; 
import axios from 'axios';
import { Link } from 'react-router-dom';

// Tipado para manejar los errores de la API
type AxiosErrorResponse = {
  response?: {
    data?: {
      message?: string;
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
  fotoPerfil?: string; 
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
  
  // Estados para la foto de perfil
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState(''); 
  const [successMsg, setSuccessMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError>({}); 

  useMemo(() => {
    // Esto se usa para limpiar el objeto URL cuando el componente se desmonta o el archivo cambia
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Función auxiliar para manejar el cambio de inputs de solo letras 
  const handleTextOnlyChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Expresión regular que solo permite letras, espacios y letras acentuadas
    const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;
    if (regex.test(e.target.value)) {
      setter(e.target.value);
    }
  };

  // Función auxiliar para manejar el cambio de inputs de solo números 
  const handleNumberOnlyChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Expresión regular que solo permite dígitos
    const regex = /^[0-9]*$/;
    if (regex.test(e.target.value)) {
      setter(e.target.value);
    }
  };

  //  Función para manejar la selección de archivo (Foto de Perfil)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationErrors(prev => ({ ...prev, fotoPerfil: undefined }));
    const file = e.target.files?.[0] || null;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Limpiar la URL anterior
    }

    if (file) {
      // Validación de tipo y tamaño
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setValidationErrors(prev => ({ ...prev, fotoPerfil: 'Solo se permiten imágenes JPEG o PNG.' }));
        setFotoPerfil(null);
        setPreviewUrl(null);
        e.target.value = ''; // Resetear el input file
        return;
      }

      if (file.size > maxSize) {
        setValidationErrors(prev => ({ ...prev, fotoPerfil: 'El tamaño de la imagen no debe exceder 5MB.' }));
        setFotoPerfil(null);
        setPreviewUrl(null);
        e.target.value = ''; 
        return;
      }

      // Establecer el nuevo archivo y URL de previsualización
      setFotoPerfil(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFotoPerfil(null);
      setPreviewUrl(null);
    }
  };

  // Función de validación del lado del cliente
  const validateForm = (): boolean => {
    // Si la función se llama directamente reiniciamos errores de archivo para que la función handleFileChange los re valide.
    const errors: ValidationError = { fotoPerfil: validationErrors.fotoPerfil }; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/; 
    const minLengthName = 3;
    const minLengthAddress = 5;

    //Validaciones 

    // Nombres
    if (nombre.length < minLengthName) {
      errors.nombre = `El nombre debe tener al menos ${minLengthName} caracteres.`;
    } else if (!nameRegex.test(nombre)) {
      errors.nombre = 'El nombre solo puede contener letras y espacios.';
    }

    //Apellidos
    if (apellido.length < minLengthName) {
      errors.apellido = `El apellido debe tener al menos ${minLengthName} caracteres.`;
    } else if (!nameRegex.test(apellido)) {
      errors.apellido = 'El apellido solo puede contener letras y espacios.';
    }

    // DNI
    if (dni.length < 7 || dni.length > 9) {
      errors.dni = 'El DNI debe tener entre 7 y 9 dígitos.';
    } else if (!/^\d+$/.test(dni)) {
      errors.dni = 'El DNI solo debe contener números.';
    }

    //Teléfono
    if (telefono.length < 8) {
      errors.telefono = 'El teléfono debe tener al menos 8 dígitos.';
    } else if (!/^\d+$/.test(telefono)) {
      errors.telefono = 'El teléfono solo debe contener números.';
    }

    //Email
    if (!emailRegex.test(email)) {
      errors.email = 'Introduce un correo electrónico válido.';
    }

    // Fecha de Nacimiento (Mayor de 18 años)
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

    //Ciudad
    if (ciudad.length < minLengthName) {
      errors.ciudad = `La ciudad debe tener al menos ${minLengthName} caracteres.`;
    } else if (!nameRegex.test(ciudad)) {
      errors.ciudad = 'La ciudad solo puede contener letras y espacios.';
    }

    // Dirección
    if (direccion.length < minLengthAddress) {
      errors.direccion = `La dirección debe tener al menos ${minLengthAddress} caracteres.`;
    } 

    //Contraseña y Confirmación
    if (contrasena.length < 8) {
      errors.contrasena = 'La clave debe tener al menos 8 caracteres.';
    }
    if (contrasena !== repetirContrasena) {
      errors.repetirContrasena = 'Las claves no coinciden.';
    }
    
        // El error ya está establecido en handleFileChange si existe
    if (fotoPerfil && errors.fotoPerfil) {
    }

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

    // Si no hay archivo, enviamos un JSON normal para el backend.

    const isFileUpload = !!fotoPerfil;
    const finalPayload = isFileUpload ? new FormData() : {} as Record<string, any>;
    
    //  Construimos el payload de datos con todos los campos obligatorios.
    const commonData = {
        nombre,
        apellido,
        dni: Number(dni), 
        telefono, 
        email,
        fecha_nacimiento: fechaNacimiento, 
        ciudad, 
        direccion, 
        contrasena,
    };
    
    if (isFileUpload) {
        // Si hay archivo, agregamos todos los campos a FormData
        Object.entries(commonData).forEach(([key, value]) => {
            finalPayload.append(key, value);
        });
        
        // Agregamos el archivo, usando el nombre de campo que espera el backend ('foto_perfil')
        finalPayload.append('foto_perfil', fotoPerfil as Blob);
    } else {
        // Si no hay archivo, usamos el objeto JSON normal
        Object.assign(finalPayload, commonData);
 
    }
    
    try {
      // Endpoint de registro
      await axios.post(
        "http://localhost:4000/api/v1/cliente", 
        finalPayload 
      );

      setSuccessMsg('¡Registro exitoso! Redirigiendo a Iniciar Sesión...');
      
      setTimeout(() => {
        window.location.href = '/login'; 
      }, 1500);

    } catch (error) {
      const err = error as AxiosErrorResponse;
      
      let message = err.response?.data?.message || err.message || "Error desconocido al registrar.";

      if (err.response?.data?.errors) {
        const validationErrorsFromApi = Object.values(err.response.data.errors).flat().join(' ');
        message += ` (Detalle: ${validationErrorsFromApi})`;
      } else if (err.response?.data) {
        message += ` (Detalle: ${JSON.stringify(err.response.data)})`;
      }

      setApiErrorMsg(message);
      
      console.error("Error de Registro (400/500):", err);
      console.warn("Payload enviado:", isFileUpload ? "FormData (archivo presente)" : finalPayload); // console.warn con FormData no muestra contenido
      
    } finally {
      setLoading(false);
      // Limpiar URL de vista previa al finalizar
      if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
      }
    }
  };

  // Componente auxiliar para mostrar errores
  const ErrorMessage = ({ message }: { message: string | undefined }) => {
    if (!message) return null;
    return <p className="mt-1 text-sm font-medium text-red-600">{message}</p>;
  };
  
  // Icono de previsualización para la foto
  const renderProfilePicture = () => {
    if (previewUrl) {
      return (
     
        <img src={previewUrl} alt="Previsualización de Perfil" className="h-20 w-20 rounded-full object-cover" />
      );
    }
    return <ImageIcon size={32} className="text-purple-400" />;
  };

  return (
    // Contenedor principal de toda la página
    <div className="relative flex min-h-screen w-full items-center justify-center 
                    from-purple-100 via-white to-purple-50 p-4 py-10 md:py-20">
      
      {/* Tarjeta de Registro */}
      <div className="w-full my-6 max-w-md rounded-2xl bg-white p-8 shadow-2xl md:p-10">
        
        {/* Encabezado */}
        <div className="mb-6 text-left">
          <h1 className="text-xl lg:text-4xl font-extrabold text-[#8F108D]">Creá tu Cuenta</h1>
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

          {/*  Campo FOTO DE PERFIL */}
          <div className="flex flex-col items-center">
            <label 
              htmlFor="foto-perfil-upload" 
              className={`flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-4 transition-colors 
                          ${validationErrors.fotoPerfil ? 'border-red-500 bg-red-50' : 'border-purple-300 bg-purple-50 hover:border-purple-500'}`}
            >
              {renderProfilePicture()}
              <input
                id="foto-perfil-upload"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">Foto de Perfil (Opcional, máx. 5MB, JPG/PNG)</p>
            <ErrorMessage message={validationErrors.fotoPerfil} />
          </div>
          
          {/* Campo Nombres */}
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
                placeholder="Nombres"
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
                placeholder="Apellidos "
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
                placeholder="DNI / Documento de Identidad"
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
                placeholder="Teléfono"
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

          {/* Campo Fecha de Nacimiento  */}
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