import MenuMob from './MenuMob';
import './navbar.css'
import { FiAlignJustify } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";

function NavBar() {
    const [mostrarMenu, setMostrarMenu] = useState(false);

    const abrirMenu = () => {
        setMostrarMenu(!mostrarMenu);
    };
    return (

        <header className="w-full fixed top-0 z-50">
            <nav className="flex justify-between p-0 md:p-4 lg:p-4 bg-[#8F108D] text-white items-center">
                <button onClick={abrirMenu} className="block md:hidden p-2 bg-[#8F108D]"> <FiAlignJustify className=" w-16 h-12" /></button>
                {/* Logo */}
                <img src="../../assets/icons/logoVet.png" alt="Logo Veterinaria" className="w-40 h-20 hidden md:flex cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 hover:cursor-pointer" />

                {/* Menú */}
                <ul className="hidden md:flex space-x-14 text-lg font-lato font-bold  ">
                    <li className='cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 hover:cursor-pointer'>INICIO</li>
                    <li className='cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 hover:cursor-pointer'>PRODUCTOS</li>
                    <li className='cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 hover:cursor-pointer'>SERVICIOS</li>
                </ul>
                
                {/* Input buscador (desktop) */}
                <div className=" justify-center px-4">
                    <div className="flex items-center border rounded overflow-hidden bg-white">
                        <input
                            className="flex-1 px-2 py-1 outline-none text-black w-[200px] md:w-[400px]"
                            type="search"
                            placeholder="Buscar"
                        />
                        <button className="p-2 bg-white border-l border-gray-600 hover:cursor-pointer hover:bg-gray-200">
                            <FaSearch className="text-gray-600 " />
                        </button>
                    </div>
                </div>
                          <ul className="hidden md:flex space-x-14  text-lg font-lato font-bold flex-row pr-10">
                    <li className='cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 hover:cursor-pointer flex items-center gap-2.5'><FaCartShopping /><span>CARRITO</span></li>
                    <li className='cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 hover:cursor-pointer flex items-center gap-2.5'><FaRegCircleUser /> <span>INGRESAR</span></li>
                   
                </ul>
                {mostrarMenu && <MenuMob onClose={abrirMenu} />}
            </nav>
        </header>
    )
}
export default NavBar



