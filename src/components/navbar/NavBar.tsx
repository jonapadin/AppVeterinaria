import { Link } from 'react-router-dom';
import { useState } from "react";
import { FaRegCircleUser, FaCartShopping, FaRightFromBracket } from "react-icons/fa6";
import { FiAlignJustify } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import MenuMob from './MenuMob';

interface NavBarProps {
    onOpenCarrito: () => void;
}
const renderLogo = () => (
        <img
            src="../../assets/icons/logoVet.png"
            alt="Logo Veterinaria"
            className="w-40 h-20 lg:w-32 lg:h-16 xl:w-40 xl:h-20 2xl:h-24 2xl:w-52 cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105"
        />
    );

function NavBar({ onOpenCarrito }: NavBarProps) {
    const [mostrarMenu, setMostrarMenu] = useState(false);

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;
    const isAdmin = userData?.isAdmin; 

    const perfilRoute = isAdmin ? "/admin" : "/user/profile";

    const abrirMenu = () => {
        setMostrarMenu(!mostrarMenu);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <header className="w-full fixed top-0 z-50">
            <nav className="flex justify-between p-0 md:p-4 bg-[#8F108D] text-white items-center">
                
                {/* 1. Botón de Menú Móvil (Solo visible si NO es Admin y hay token, o si no hay token) */}
                {!isAdmin && (
                    <button onClick={abrirMenu} className="block lg:hidden p-2 bg-[#8F108D]">
                        <FiAlignJustify className="w-16 h-12" />
                    </button>
                )}

                {/* 2. Logo - Ajustado para estar siempre a la izquierda y dentro del nav */}

               {isAdmin ? (
                    // Si es Admin, el logo no tiene enlace (es un simple div)
                    <div >
                        {renderLogo()}
                    </div>
                ) : (
                    // Si NO es Admin, el logo es un enlace a la página principal
                    <Link to={"/"} >
                        {renderLogo()}
                    </Link>
                )}

                {/* 3. Menú principal (OCULTAR para Admin) */}
                {!isAdmin && (
                    <ul className="hidden lg:flex space-x-14 lg:space-x-8 lg:text-sm xl:text-xl 2xl:space-x-14 font-lato font-bold">
                        {token ? (
                            <Link to={userData?.isAdmin ? '/admin' : '/user'}>
                                <li className='cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105'>INICIO</li>
                            </Link>
                        ) : (
                            <Link to={"/"}>
                                <li className='cursor-pointer transition-all duration-300 hover:hover:scale-105'>INICIO</li>
                            </Link>
                        )}
                        <Link to={"/categoria"}>
                            <li className='cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105'>PRODUCTOS</li>
                        </Link>
                        <Link to={"/services"}>
                            <li className='cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105'>SERVICIOS</li>
                        </Link>
                    </ul>
                )}

                {/* 4. Buscador desktop (OCULTAR para Admin) */}
                {!isAdmin && (
                    <div className="justify-center px-4 md:mr-48 lg:mr-0">
                        <div className="flex items-center border rounded overflow-hidden bg-white">
                            <input
                                className="buscador flex-1 px-2 py-1 outline-none text-black w-[230px] md:w-[400px] lg:w-[220px] xl:w-[300px] 2xl:w-[350px]"
                                type="search"
                                placeholder="Buscar"
                            />
                            <button className="p-2 bg-white border-l border-gray-600 hover:bg-gray-200">
                                <FaSearch className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}


                {/* 5. Iconos de Carrito + Login/Logout + Perfil */}
                {/* 5.1. Si es Admin, solo mostramos Logout en un formato simplificado */}
                {isAdmin ? (
                    <ul className="lg:flex space-x-8 lg:text-sm xl:text-xl text-lg font-lato font-bold pr-10 hidden md:flex">
                        {/* Botón CERRAR SESIÓN para Admin */}
                        <li
                            onClick={handleLogout}
                            className="cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 flex items-center gap-2.5"
                        >
                            <FaRightFromBracket />
                            <span>CERRAR SESIÓN</span>
                        </li>
                    </ul>

                ) : (
                    /* 5.2. Si NO es Admin (o no está logueado), mostramos la barra completa de iconos */
                    <ul className="hidden lg:flex space-x-14 lg:space-x-8 lg:text-sm xl:text-xl text-lg font-lato font-bold pr-10">
                        {/* Carrito */}
                        <li
                            onClick={onOpenCarrito}
                            className="cursor-pointer hover:scale-105 flex items-center gap-2.5"
                        >
                            <FaCartShopping />
                            <span>CARRITO</span>
                        </li>

                        {/* Botón MI PERFIL (solo logueado) */}
                        {token && (
                            <Link to={perfilRoute}>
                                <li className="cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 flex items-center gap-2.5">
                                    <FaRegCircleUser />
                                    <span>MI PERFIL</span>
                                </li>
                            </Link>
                        )}

                        {/* Login / Logout */}
                        {token ? (
                            <li
                                onClick={handleLogout}
                                className="cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 flex items-center gap-2.5"
                            >
                                <FaRightFromBracket />
                                <span>CERRAR SESIÓN</span>
                            </li>
                        ) : (
                            <Link to={"login"}>
                                <li className="cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 flex items-center gap-2.5">
                                    <FaRegCircleUser />
                                    <span>INGRESAR</span>
                                </li>
                            </Link>
                        )}
                    </ul>
                )}


                {/* 6. Menú móvil (OCULTAR si es Admin) */}
                {mostrarMenu && !isAdmin && (
                    <MenuMob
                        isAuthenticated={!!token}
                        onLogout={handleLogout}
                        onClose={abrirMenu}
                        onOpenCarrito={onOpenCarrito}
                    />
                )}
            </nav>
        </header>
    );
}

export default NavBar;