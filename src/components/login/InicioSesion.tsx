import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { loginSuccess } from "../../features/usuarios/authSlice";
import { Link } from "react-router-dom";



interface LoginResponse {
  access_token: string;
  user: {
    email: string;
    role: "empleado" | "cliente";
    isAdmin: boolean;
  };
}

type AxiosErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
};

export default function InicioSesion() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga
  const [errorMsg, setErrorMsg] = useState(""); // Para mostrar mensajes de error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data } = await axios.post<LoginResponse>(
        "http://localhost:4000/api/v1/auth/login",
        {
          email,
          contrasena: password,
        },
      );
      
      //Guardar el token en localStorage para que NavBar lo detecte
      localStorage.setItem("token", data.access_token);

      //Guardar el estado en Redux
      dispatch(
        loginSuccess({
          token: data.access_token,
          user: data.user,
        }),
      );

      // Redirección
      if (data.user.isAdmin === true) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/user";
      }
    } catch (error) {
      const err = error as AxiosErrorResponse;
      
      const message =
        err.response?.data?.message || err.message || "Error desconocido. Intente más tarde.";

      setErrorMsg(message);
      console.error("Error de Login:", error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="py-38 relative flex min-h-screen w-full items-center justify-center 
                    from-purple-100 via-white to-purple-50 p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl md:p-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">¡Hola de Nuevo!</h1>
          <p className="mt-2 text-gray-500">Inicia sesión para continuar</p>
        </div>

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm font-medium text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Formulario funcional */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
              <Mail size={20} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@correo.com"
              className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4
                          focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
              <Lock size={20} />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="**********"
              className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4
                          focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

        
          <div className="text-right">
            <a href="recover-pass" className="text-sm text-purple-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          

          <button
            type="submit"
            className={`w-full rounded-lg py-3 font-semibold text-white shadow-lg
                        transition-all hover:shadow-xl ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8F108D] hover:bg-[#790e77]'}`}
            disabled={loading}
          >
            {loading ? "Cargando..." : "INGRESAR"}
          </button>

          <Link to="/register"><button
            type="button"
            className="w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-600 transition-all
                          hover:bg-gray-100"
          >
            REGISTRARSE
          </button>
          </Link> 
        </form>

        <div className="my-6 flex items-center">
          <div className="border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-400"></span>
          <div className="border-t border-gray-300"></div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a href="https://google.com/"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg
                          border border-gray-300 py-2.5 text-gray-700
                          transition-all hover:bg-gray-100"
          >
            <FcGoogle size={22} />
            <span className="font-medium">Ingresar con Google</span>
          </a>

          <a href="https://www.facebook.com/?locale=es_LA"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg
                          border border-gray-300 py-2.5 text-gray-700
                          transition-all hover:bg-gray-100"
          >
            <FaFacebook size={22} className="text-blue-600" />
            <span className="font-medium">Ingresar con Facebook</span>
          </a>
        </div>
      </div>
    </div>
  );
}