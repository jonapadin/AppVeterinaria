const API_BASE_URL = "https://apiv1-vet.onrender.com/api/v1";

/**
 * Función genérica para hacer peticiones FETCH
 * @param endpoint Ej: '/cliente'
 * @param options Opciones de Fetch (method, headers, body)
 */
export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // 1. Obtener el token de localStorage
  const token = localStorage.getItem("token");

  // 2. Headers por defecto
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // 3. AÑADIR EL TOKEN DE AUTENTICACIÓN SI EXISTE
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      console.error("❌ Error en la API:", {
        status: response.status,
        statusText: response.statusText,
        message: errorData.message,
        details: errorData,
        url: url,
      });

      if (response.status === 401 || response.status === 403) {
        console.error("Error de autenticación. Redirigiendo al login...");
      }

      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`,
      );
    }

    if (config.method === "DELETE" || response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en la petición a ${url}:`, error);
    throw error;
  }
};

