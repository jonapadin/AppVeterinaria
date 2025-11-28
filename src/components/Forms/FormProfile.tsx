import { useEffect, useState, type useMemo, type FC } from 'react';
import { Link } from 'react-router-dom';
// Importamos todas las iconos necesarios
import { FaRegUser, FaEnvelope, FaPhone, FaCalendarAlt, FaIdCard, FaMapMarkerAlt, FaHome, FaCamera, FaSave } from "react-icons/fa"; 
import { Lock, Image as ImageIcon, Trash2 } from 'lucide-react'; 

// 1. Tipado para los datos del usuario (basado en la entidad proporcionada)
type UserData = {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string; // Asumimos que también está en la entidad aunque no se muestre
  fecha_nacimiento: string; // Se manejará como string (YYYY-MM-DD) para el input[type="date"]
  ciudad: string;
  direccion: string;
  foto_perfil?: string | null; // URL de la foto de perfil
};

// 2. Tipado para errores de validación
type ValidationError = {
  [key: string]: string | undefined;
};

// --- COMPONENTES AUXILIARES ---

// Componente auxiliar para mostrar errores
const ErrorMessage: FC<{ message: string | undefined }> = ({ message }) => {
  if (!message) return null;
  return <p className="mt-1 text-sm font-medium text-red-600">{message}</p>;
};

// Componente auxiliar para un input genérico
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
};

const InputGroup: FC<InputGroupProps> = ({ id, label, value, onChange, Icon, type = "text", error, placeholder, disabled = false }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <div className={`flex items-center mt-2 p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'bg-gray-100' : 'bg-white'}`}>
            <Icon className="w-5 h-5 text-gray-400" />
            <input
                id={id as string} 
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder || `Tu ${label.toLowerCase()}`}
                className={`ml-2 flex-1 p-2 border-none focus:outline-none ${disabled ? 'bg-transparent text-gray-600' : ''}`}
                disabled={disabled}
            />
        </div>
        <ErrorMessage message={error} /> 
    </div>
);

// --- COMPONENTE PRINCIPAL ---

function Formulario() {
  // Estados para los datos del usuario (Inicialmente vacío o con datos simulados)
  const [userData, setUserData] = useState<UserData | null>({
    nombre: '', apellido: '', dni: '', telefono: '', email: '', 
    fecha_nacimiento: '', ciudad: '', direccion: '', foto_perfil: null
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState(''); 
  const [successMsg, setSuccessMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError>({}); 

  // Estados para la edición de la foto
  const [newFotoPerfilFile, setNewFotoPerfilFile] = useState<File | null>(null);
  const [newFotoPerfilPreviewUrl, setNewFotoPerfilPreviewUrl] = useState<string | null>(null);
  const [shouldRemovePhoto, setShouldRemovePhoto] = useState(false);

  // URL del endpoint (Ajustar a tu API real)
  const API_URL = "http://localhost:4000/api/v1/cliente/perfil"; 

  // LÓGICA DE CARGA INICIAL (Simulación de GET)
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setApiErrorMsg("No autenticado. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        // SIMULACIÓN DE LLAMADA API - REEMPLAZAR CON TU AXIOS REAL
        /* const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedData = response.data;
        */
        
        // Datos de ejemplo simulados
        const fetchedData: UserData = {
            nombre: "Juan",
            apellido: "Perez",
            dni: "12345678",
            telefono: "987654321",
            email: "juan.perez@ejemplo.com",
            fecha_nacimiento: "1990-05-15",
            ciudad: "Madrid",
            direccion: "Calle Falsa 123",
            foto_perfil: "https://placehold.co/100x100/8F108D/FFFFFF?text=JP" // URL simulada
        };

        // --- Fin de simulación ---
        
        setUserData(fetchedData); 
        setLoading(false);
        setApiErrorMsg('');
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        setApiErrorMsg("Error al cargar la información del perfil.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); 

  // Limpieza de URL de previsualización
  useEffect(() => {
    return () => {
      if (newFotoPerfilPreviewUrl) {
        URL.revokeObjectURL(newFotoPerfilPreviewUrl);
      }
    };
  }, [newFotoPerfilPreviewUrl]);

  // --- HANDLERS DE CAMBIOS (INPUTS) ---

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
      // Validaciones básicas de archivo
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

  // --- LÓGICA DE VALIDACIÓN (Simple) ---

  const validateForm = (): boolean => {
    if (!userData) return false;
    const errors: ValidationError = {};
    
    // Validación de ejemplo: Nombre y Apellido no pueden estar vacíos
    if (!userData.nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
    if (!userData.apellido.trim()) errors.apellido = 'El apellido es obligatorio.';

    // ... (Aquí iría la validación completa para todos los campos: DNI, Teléfono, etc.)
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // --- HANDLER DE ENVÍO (PUT) ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiErrorMsg('');
    setSuccessMsg('');

    if (!userData) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    if (!token) {
        setApiErrorMsg("Token no encontrado.");
        setIsSubmitting(false);
        return;
    }

    // 1. Crear el payload (FormData para archivo, JSON para solo texto)
    const isFileUpdate = !!newFotoPerfilFile || shouldRemovePhoto;
    let finalPayload: FormData | Partial<UserData>;
    
    if (isFileUpdate) {
        const form = new FormData();

        // Agregar campos de texto al FormData
        Object.entries(userData).forEach(([key, value]) => {
            if (key !== 'foto_perfil' && value !== null) {
                 // Convertir DNI a string si es numérico en la entidad y se pasa como string aquí
                form.append(key, String(value)); 
            }
        });

        // Manejar el archivo
        if (newFotoPerfilFile) {
            form.append('foto_perfil', newFotoPerfilFile);
        } else if (shouldRemovePhoto) {
            form.append('foto_perfil', ''); // Señal para el backend para eliminar
        }

        finalPayload = form;
    } else {
        // Solo datos JSON (sin cambios en la foto)
        const { foto_perfil, ...dataToSend } = userData; 
        finalPayload = dataToSend;
    }

    try {
        // SIMULACIÓN DE LLAMADA API - REEMPLAZAR CON TU AXIOS REAL
        /*
        await axios.put(API_URL, finalPayload, {
            headers: {
                Authorization: `Bearer ${token}`,
                // Axios detectará 'multipart/form-data' si el payload es FormData
                // o 'application/json' si es un objeto JSON.
            }
        });
        */

        // --- Inicio de simulación (Retraso) ---
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        // --- Fin de simulación ---


        setSuccessMsg('¡Perfil actualizado con éxito!');
        
        // Actualizar el estado para reflejar el cambio (Foto)
        if (shouldRemovePhoto) {
             setUserData(prev => prev ? ({ ...prev, foto_perfil: null }) : null);
        } else if (newFotoPerfilPreviewUrl) {
             // En un caso real, obtendrías la URL final del backend. Aquí usamos la preview.
             setUserData(prev => prev ? ({ ...prev, foto_perfil: newFotoPerfilPreviewUrl }) : null);
        }

        // Limpiar estados
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); 
  };

  // Determinar la URL de la foto a mostrar
  const getCurrentPhotoUrl = (): string | null => {
    if (newFotoPerfilPreviewUrl) {
      return newFotoPerfilPreviewUrl; 
    }
    if (userData?.foto_perfil && !shouldRemovePhoto) {
      return userData.foto_perfil; 
    }
    return null; 
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto p-6 my-36 bg-white shadow-lg rounded-lg text-center">
        Cargando perfil...
      </div>
    );
  }

  if (!userData) return null; // Debe ser imposible si loading es false y no hay error crítico

  return (
    <form className="max-w-lg mx-auto p-6 my-9 bg-white shadow-lg rounded-lg 2xl:py-36" onSubmit={handleSubmit}>
      
      {/* 3. ENCABEZADO CON FOTO DE PERFIL */}
      <div className="flex flex-col items-center mb-6 border-b pb-4">
        <div className='relative w-24 h-24 mb-3'>
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-[#8F108D]">
            {getCurrentPhotoUrl() ? (
              <img 
                src={getCurrentPhotoUrl() as string} 
                alt="Foto de Perfil" 
                className="w-full h-full object-cover" 
                // Fallback en caso de que la URL de la imagen falle
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
                className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center"
                disabled={isSubmitting}
            >
                <Trash2 size={12} className="mr-1" />
                Eliminar foto actual
            </button>
        )}
      </div>

      {/* Mensajes de estado */}
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
      <ErrorMessage message={validationErrors.foto_perfil} />

      {/* 4. CAMPOS EDITABLES COMPLETOS */}
      
      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <InputGroup 
            id="nombre" 
            label="Nombre" 
            value={userData.nombre} 
            onChange={handleInputChange} 
            Icon={FaRegUser} 
            error={validationErrors.nombre}
          />
          <InputGroup 
            id="apellido" 
            label="Apellido" 
            value={userData.apellido} 
            onChange={handleInputChange} 
            Icon={FaRegUser} 
            error={validationErrors.apellido}
          />
      </div>

      {/* DNI y Teléfono */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup 
            id="dni" 
            label="DNI" 
            value={userData.dni} 
            onChange={handleInputChange} 
            Icon={FaIdCard} 
            type="number"
            error={validationErrors.dni}
          />
          <InputGroup 
            id="telefono" 
            label="Teléfono" 
            value={userData.telefono} 
            onChange={handleInputChange} 
            Icon={FaPhone} 
            type="tel"
            error={validationErrors.telefono}
          />
      </div>
      
      {/* Email (Generalmente deshabilitado) */}
      <InputGroup 
          id="email" 
          label="Correo electrónico" 
          value={userData.email} 
          onChange={handleInputChange} 
          Icon={FaEnvelope} 
          type="email"
          error={validationErrors.email}
          disabled={true}
          placeholder="Tu correo electrónico"
      />
      <span className='text-xs text-gray-500 ml-1 -mt-3 block mb-4'>El email no se puede cambiar directamente.</span>


      {/* Fecha de Nacimiento */}
      <InputGroup 
          id="fecha_nacimiento" 
          label="Fecha de Nacimiento" 
          value={userData.fecha_nacimiento} 
          onChange={handleInputChange} 
          Icon={FaCalendarAlt} 
          type="date"
          error={validationErrors.fecha_nacimiento}
      />

      {/* Ciudad y Dirección */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup 
            id="ciudad" 
            label="Ciudad" 
            value={userData.ciudad} 
            onChange={handleInputChange} 
            Icon={FaMapMarkerAlt} 
            error={validationErrors.ciudad}
          />
          <InputGroup 
            id="direccion" 
            label="Dirección" 
            value={userData.direccion} 
            onChange={handleInputChange} 
            Icon={FaHome} 
            error={validationErrors.direccion}
          />
      </div>
      
      {/* Botón de envío */}
      <button
        type="submit"
        className={`w-full py-3 px-4 mt-6 flex justify-center items-center text-white font-semibold rounded-md transition-colors 
                    ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8F108D] hover:bg-[#790e77]'}`}
        disabled={isSubmitting}
      >
        <FaSave className="w-5 h-5 mr-2" />
        {isSubmitting ? "Guardando..." : "GUARDAR CAMBIOS"}
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