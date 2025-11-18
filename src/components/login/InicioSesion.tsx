import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { loginSuccess } from "../../features/usuarios/authSlice";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.post<LoginResponse>(
        "http://localhost:3000/api/v1/auth/login",
        {
          email,
          contrasena: password,
        },
      );

      dispatch(
        loginSuccess({
          token: data.access_token,
          user: data.user,
        }),
      );

      if (data.user.isAdmin === true) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      const err = error as AxiosErrorResponse;

      const message =
        err.response?.data?.message || err.message || "Error desconocido";

      alert(message);
    }
  };

  return (
    <div
      className="py-38 relative flex min-h-screen w-full items-center justify-center  
                  bg-gradient-to-br from-purple-100 via-white to-purple-50 p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl md:p-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">¡Hola de Nuevo!</h1>
          <p className="mt-2 text-gray-500">Inicia sesión para continuar</p>
        </div>

        {/* ✅ Formulario funcional */}
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
            <a href="#" className="text-sm text-purple-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#8F108D] py-3 font-semibold text-white shadow-lg
                         transition-all hover:bg-[#790e77] hover:shadow-xl"
          >
            INGRESAR
          </button>

          <button
            type="button"
            className="w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-600 transition-all
                         hover:bg-gray-100"
          >
            REGISTRARSE
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-400">o</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg
                         border border-gray-300 py-2.5 text-gray-700
                         transition-all hover:bg-gray-100"
          >
            <FcGoogle size={22} />
            <span className="font-medium">Ingresar con Google</span>
          </button>

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
