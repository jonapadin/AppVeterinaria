import { useEffect, useState, type FC } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaRegUser, FaEnvelope, FaPhone, FaCalendarAlt, FaIdCard, FaMapMarkerAlt, FaHome, FaCamera, FaSave } from "react-icons/fa";
import { Image as ImageIcon, Trash2, Lock } from 'lucide-react';

// 1. Tipado para los datos del usuario
type UserData = {
  nombre: string;
  apellido: string;
  dni: number;
  telefono: string;
  email: string;
  fecha_nacimiento: string;
  ciudad: string;
  direccion: string;
  foto_perfil?: string | null;
};

//  Tipado para errores de validación
type ValidationError = {
  [key in keyof UserData]?: string;
};

// COMPONENTES AUXILIARES

const ErrorMessage: FC<{ message: string | undefined }> = ({ message }) => {
  if (!message) return null;
  return <p className="mt-1 text-sm font-medium text-red-600">{message}</p>;
};

type InputGroupProps = {
  id: keyof UserData;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon: React.ElementType;
  type?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  onBlur?: () => void;
};

const InputGroup: FC<InputGroupProps> = ({ id, label, value, onChange, Icon, type = "text", error, placeholder, disabled = false, onBlur }) => (
  <div className="mb-4">
    <label htmlFor={id as string} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className={`flex items-center mt-2 p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'bg-gray-100' : 'bg-white'}`}>
      <Icon className="w-5 h-5 text-gray-400" />
      <input
        id={id as string}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder || `Tu ${label.toLowerCase()}`}
        className={`ml-2 flex-1 p-2 border-none focus:outline-none ${disabled ? 'bg-transparent text-gray-600' : ''}`}
        disabled={disabled}
      />
    </div>
    <ErrorMessage message={error} />
  </div>
);


// COMPONENTE PRINCIPAL

function Formulario() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError>({});

  //  NUEVOS ESTADOS DE CONTROL
  const [userRole, setUserRole] = useState<'cliente' | 'empleado' | null>(null);
  const [entityId, setEntityId] = useState<number | null>(null); // ID del cliente o empleado

  const [newFotoPerfilFile, setNewFotoPerfilFile] = useState<File | null>(null);
  const [newFotoPerfilPreviewUrl, setNewFotoPerfilPreviewUrl] = useState<string | null>(null);
  const [shouldRemovePhoto, setShouldRemovePhoto] = useState(false);

  const BASE_URL = "http://localhost:apiv1-vet.onrender.com/api/v1";

  //OBTENER ID y CAPTURAR ID de ENTIDAD
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      if (!token || !userString) {
        setApiErrorMsg("No autenticado. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userString);
        const userId = user.id;

        if (!userId) {
          setApiErrorMsg("ID de usuario no encontrado en la sesión.");
          setLoading(false);
          return;
        }

        const API_URL = `${BASE_URL}/usuarios/${userId}`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedData = response.data as {
          email: string;
          cliente?: any;
          empleado?: any;
          foto_perfil?: string | null;
        };

        let profileData: any = null;

        if (fetchedData.cliente) {
          profileData = fetchedData.cliente;
          setUserRole('cliente');
          setEntityId(profileData.id); //  Capturar ID de Cliente
        } else if (fetchedData.empleado) {
          profileData = fetchedData.empleado;
          setUserRole('empleado');
          setEntityId(profileData.id); //  Capturar ID de Empleado
        }

        if (!profileData) {
          setApiErrorMsg("No se encontró información de perfil (ni cliente, ni empleado) asociada a tu cuenta.");
          setLoading(false);
          return;
        }

        const finalUserData: UserData = {
          email: fetchedData.email,
          nombre: profileData.nombre || '',
          apellido: profileData.apellido || '',
          dni: Number(profileData.dni || ''),
          telefono: String(profileData.telefono || ''),
          ciudad: profileData.ciudad || '',
          direccion: profileData.direccion || '',
          fecha_nacimiento: profileData.fecha_nacimiento
            ? profileData.fecha_nacimiento.substring(0, 10)
            : '',
          foto_perfil: profileData.foto_perfil || fetchedData.foto_perfil || null
        };

        setUserData(finalUserData);
        setLoading(false);
        setApiErrorMsg('');

      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        const err = error as any;
        const message = err.response?.data?.message || err.message || "Error al cargar la información del perfil.";
        setApiErrorMsg(message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData(prev => prev ? ({ ...prev, [id]: value } as UserData) : null);
    setValidationErrors(prev => ({ ...prev, [id]: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationErrors(prev => ({ ...prev, foto_perfil: undefined }));
    const file = e.target.files?.[0] || null;

    if (newFotoPerfilPreviewUrl) {
      URL.revokeObjectURL(newFotoPerfilPreviewUrl);
    }

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setValidationErrors(prev => ({ ...prev, foto_perfil: 'Solo se permiten imágenes JPEG o PNG.' }));
        setNewFotoPerfilFile(null);
        setNewFotoPerfilPreviewUrl(null);
        e.target.value = '';
        return;
      }

      if (file.size > maxSize) {
        setValidationErrors(prev => ({ ...prev, foto_perfil: 'El tamaño de la imagen no debe exceder 5MB.' }));
        setNewFotoPerfilFile(null);
        setNewFotoPerfilPreviewUrl(null);
        e.target.value = '';
        return;
      }

      setNewFotoPerfilFile(file);
      setNewFotoPerfilPreviewUrl(URL.createObjectURL(file));
      setShouldRemovePhoto(false);
    } else {
      setNewFotoPerfilFile(null);
      setNewFotoPerfilPreviewUrl(null);
    }
  };

  const handleRemovePhoto = () => {
    if (newFotoPerfilPreviewUrl) {
      URL.revokeObjectURL(newFotoPerfilPreviewUrl);
      setNewFotoPerfilPreviewUrl(null);
    }
    setNewFotoPerfilFile(null);
    setUserData(prev => prev ? ({ ...prev, foto_perfil: null }) : null);
    setShouldRemovePhoto(true);
  };

  const validateForm = (): boolean => {
    if (!userData) return false;
    const errors: ValidationError = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;
    const minLengthName = 3;
    const minLengthAddress = 5;
    const today = new Date();

    // Validaciones
    if (userData.nombre.length < minLengthName || !nameRegex.test(userData.nombre)) {
      errors.nombre = 'Nombre inválido (mín. 3 letras y espacios).';
    }
    if (userData.apellido.length < minLengthName || !nameRegex.test(userData.apellido)) {
      errors.apellido = 'Apellido inválido (mín. 3 letras y espacios).';
    }
    if (String(userData.dni).length < 7 || String(userData.dni).length > 9 || !/^\d+$/.test(String(userData.dni))) {
      errors.dni = 'El DNI debe tener entre 7 y 9 dígitos.';
    }
    if (userData.telefono.length < 8 || !/^\d+$/.test(userData.telefono)) {
      errors.telefono = 'El teléfono debe tener al menos 8 dígitos.';
    }
    if (userData.email && !emailRegex.test(userData.email)) {
      errors.email = 'Introduce un correo electrónico válido.';
    }
    if (!userData.fecha_nacimiento) {
      errors.fecha_nacimiento = 'La fecha de nacimiento es requerida.';
    } else {
      const birthDate = new Date(userData.fecha_nacimiento);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      const isUnderage = age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));
      if (isUnderage) {
        errors.fecha_nacimiento = 'Debes ser mayor de 18 años.';
      }
    }
    if (userData.ciudad.length < minLengthName || !nameRegex.test(userData.ciudad)) {
      errors.ciudad = 'Ciudad inválida (mín. 3 letras y espacios).';
    }
    if (userData.direccion.length < minLengthAddress) {
      errors.direccion = `La dirección debe tener al menos ${minLengthAddress} caracteres.`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // HANDLER DE ENVÍO (PATCH) AL ENDPOINT DE ENTIDAD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiErrorMsg('');
    setSuccessMsg('');

    if (!userData || !userRole || !entityId) {
      setApiErrorMsg("Error de configuración: El rol o ID de perfil no se ha cargado correctamente.");
      setIsSubmitting(false);
      return;
    }
    if (!validateForm()) {
      setApiErrorMsg("Por favor, corrige los errores de validación en el formulario.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setApiErrorMsg("Sesión no válida. Por favor, inicia sesión de nuevo.");
      setIsSubmitting(false);
      return;
    }

    // 1. Construir la URL de actualización para la entidad
    const API_URL_ENTITY_PATCH = `${BASE_URL}/${userRole}/${entityId}`;

    const isFileUpdate = !!newFotoPerfilFile || shouldRemovePhoto;
    let finalPayload: FormData | Partial<UserData>;

    // 2. Crear el objeto de datos a enviar (Siempre plano, excluyendo email)
    const dataToSend: Partial<UserData> = {
      nombre: userData.nombre,
      apellido: userData.apellido,
      dni: Number(userData.dni),
      telefono: userData.telefono,
      ciudad: userData.ciudad,
      direccion: userData.direccion,
      fecha_nacimiento: userData.fecha_nacimiento,
    };


    if (isFileUpdate) {
      const form = new FormData();

      Object.entries(dataToSend).forEach(([key, value]) => {

        // Limpiar DNI y Teléfono antes de enviarlos como string
        if (key === 'dni') {
          const cleaned = String(value ?? '').replace(/\D/g, '');
          form.append('dni', cleaned);
        } else {
          form.append(key, String(value ?? ''));
        }

      });

      if (newFotoPerfilFile) {
        form.append('foto_perfil', newFotoPerfilFile);
      } else if (shouldRemovePhoto) {
        form.append('foto_perfil', '');
      }

      finalPayload = form;

    } else {
      finalPayload = dataToSend;
    }

    try {
      await axios.patch(API_URL_ENTITY_PATCH, finalPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setSuccessMsg('¡Perfil actualizado con éxito!');

      if (shouldRemovePhoto) {
        setUserData(prev => prev ? ({ ...prev, foto_perfil: null }) : null);
      } else if (newFotoPerfilPreviewUrl) {
        setUserData(prev => prev ? ({ ...prev, foto_perfil: newFotoPerfilPreviewUrl }) : null);
      }

      setNewFotoPerfilFile(null);
      if (newFotoPerfilPreviewUrl) URL.revokeObjectURL(newFotoPerfilPreviewUrl);
      setNewFotoPerfilPreviewUrl(null);
      setShouldRemovePhoto(false);

    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      const err = error as any;
      const message = err.response?.data?.message || err.message || "Error desconocido al actualizar.";
      setApiErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // LÓGICA DE CIERRE DE SESIÓN Y OBTENCIÓN DE FOTO

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const getCurrentPhotoUrl = (): string | null => {
    if (newFotoPerfilPreviewUrl) return newFotoPerfilPreviewUrl;
    if (userData?.foto_perfil && !shouldRemovePhoto) return userData.foto_perfil;
    return null;
  };


  if (loading) {
    return (
      <div className="max-w-lg mx-auto p-6 my-36 bg-white shadow-lg rounded-lg text-center">
        Cargando perfil...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-lg mx-auto p-6 my-36 bg-white shadow-lg rounded-lg text-center">
        <p className="text-red-600 font-bold">{apiErrorMsg}</p>
        <Link to="/login" className="mt-4 inline-block text-[#8F108D] hover:underline">Ir a Iniciar Sesión</Link>
      </div>
    );
  }

  // RENDERIZADO DEL FORMULARIO
  return (
    <form className="max-w-lg mx-auto my-24 px-4  bg-white shadow-lg rounded-lg 2xl:py-36" onSubmit={handleSubmit}>

      <div className="flex flex-col items-center mb-6 border-b pb-4">
        <div className='relative w-24 h-24 mb-3'>
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-[#8F108D]">
            {getCurrentPhotoUrl() ? (
              <img
                src={getCurrentPhotoUrl() as string}
                alt="Foto de Perfil"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/100x100/94A3B8/FFFFFF?text=FAIL";
                }}
              />
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-500" />
            )}
          </div>
          {/* Botón para subir/cambiar foto */}
          <label
            htmlFor="foto-perfil-upload"
            className="absolute bottom-0 right-0 p-1.5 bg-[#8F108D] text-white rounded-full cursor-pointer hover:bg-[#790e77] transition-colors"
            title="Cambiar foto de perfil"
          >
            <FaCamera size={16} />
            <input
              id="foto-perfil-upload"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              disabled={isSubmitting}
            />
          </label>
        </div>

        <h1 className="text-xl lg:text-3xl font-extrabold text-[#8F108D]">
          {userData.nombre || 'Usuario'} {userData.apellido}
        </h1>
        <span className="text-sm text-gray-500">Información personal</span>

        {/* Botón para eliminar foto existente */}
        {(userData.foto_perfil || newFotoPerfilFile) && !shouldRemovePhoto && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="mt-2 text-sm text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
            disabled={isSubmitting}
          >
            <Trash2 size={16} />
            Eliminar foto
          </button>
        )}
      </div>

      {/* Mensajes de la API */}
      {apiErrorMsg && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm font-medium text-red-700">{apiErrorMsg}</div>
      )}
      {successMsg && (
        <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm font-medium text-green-700">{successMsg}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup id="nombre" label="Nombre" value={userData.nombre} onChange={handleInputChange} Icon={FaRegUser} error={validationErrors.nombre} onBlur={validateForm} />
        <InputGroup id="apellido" label="Apellido" value={userData.apellido} onChange={handleInputChange} Icon={FaRegUser} error={validationErrors.apellido} onBlur={validateForm} />

        <InputGroup id="dni" label="DNI" value={userData.dni} onChange={handleInputChange} Icon={FaIdCard} error={validationErrors.dni} type="text" placeholder="Documento de Identidad" onBlur={validateForm} />
        <InputGroup id="telefono" label="Teléfono" value={userData.telefono} onChange={handleInputChange} Icon={FaPhone} error={validationErrors.telefono} type="tel" placeholder="Número de Teléfono" onBlur={validateForm} />

        {/* EMAIL: No editable */}
        <InputGroup id="email" label="Email" value={userData.email} onChange={handleInputChange} Icon={FaEnvelope} error={validationErrors.email} type="email" disabled={true} />

        <InputGroup id="fecha_nacimiento" label="Fecha de Nacimiento" value={userData.fecha_nacimiento} onChange={handleInputChange} Icon={FaCalendarAlt} error={validationErrors.fecha_nacimiento} type="date" onBlur={validateForm} />

        <InputGroup id="ciudad" label="Ciudad" value={userData.ciudad} onChange={handleInputChange} Icon={FaMapMarkerAlt} error={validationErrors.ciudad} onBlur={validateForm} />
        <InputGroup id="direccion" label="Dirección" value={userData.direccion} onChange={handleInputChange} Icon={FaHome} error={validationErrors.direccion} onBlur={validateForm} />

      </div>

      <button
        type="submit"
        className={`w-full mt-6 flex items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white shadow-lg transition-all
                            ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8F108D] hover:bg-[#790e77] hover:shadow-xl'}`}
        disabled={isSubmitting}
      >
        <FaSave size={20} />
        {isSubmitting ? "Guardando..." : "GUARDAR CAMBIOS"}
      </button>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full mt-3 rounded-lg border border-gray-300 py-3 font-semibold text-gray-600 transition-all hover:bg-gray-100"
      >
        CERRAR SESIÓN
      </button>
      {/* Seguridad y Cerrar Sesión */}
      <div className="mt-8 border-t pt-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <Lock size={20} className="mr-2 text-gray-500" /> Seguridad
        </h2>

        <div className="flex flex-col gap-3">
          <Link to="/recover-pass">
            <button
              type="button"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cambiar contraseña
            </button>
          </Link>
          <button
            onClick={handleLogout}
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