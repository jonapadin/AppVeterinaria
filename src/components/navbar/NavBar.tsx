import MenuMob from './MenuMob';
import { FiAlignJustify } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function NavBar() {
    const [mostrarMenu, setMostrarMenu] = useState(false);

    const abrirMenu = () => {
        setMostrarMenu(!mostrarMenu);
    };
    return (

        <header className="w-full fixed top-0 z-50">
            <nav className="flex justify-between p-0 md:p-4 md:relative lg:static lg:p-4 bg-[#8F108D] text-white items-center">
                <button onClick={abrirMenu} className="block lg:hidden  p-2 bg-[#8F108D]"> <FiAlignJustify className=" w-16 h-12" /></button>
                {/* Logo */}
                <img src="../../assets/icons/logoVet.png" alt="Logo Veterinaria" className="w-40 h-20 lg:w-32 lg:h-16 xl:w-40 xl:h-20 2xl:h-24 2xl:w-52 hidden md:flex cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 hover:cursor-pointer md:absolute md:right-5 lg:static" />

                {/* Menú */}
                <ul className="hidden lg:flex space-x-14 lg:space-x-8 lg:text-sm xl:text-xl  2xl:space-x-14  font-lato font-bold  ">
                   <Link to= {"/"} > <li className='cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 hover:cursor-pointer'>INICIO</li></Link>
                    <Link to= {"categoria"}> <li className='cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 hover:cursor-pointer'>PRODUCTOS</li></Link>
                   <Link to= {"services"}>  <li className='cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 hover:cursor-pointer'>SERVICIOS</li></Link>
                </ul>
                
                {/* Input buscador (desktop) */}
                <div className=" justify-center px-4 md:mr-48 lg:mr-0  ">
                    <div className="flex items-center border rounded overflow-hidden bg-white">
                        <input
                            className="flex-1 px-2 py-1 outline-none text-black w-[220px] md:w-[400px] lg:w-[220px] xl:w-[300px] 2xl:w-[350px] "
                            type="search"
                            placeholder="Buscar"
                        />
                        <button className="p-2 bg-white border-l border-gray-600 hover:cursor-pointer hover:bg-gray-200">
                            <FaSearch className="text-gray-600 " />
                        </button>
                    </div>
                </div>
                          <ul className="hidden lg:flex space-x-14 lg:space-x-8  lg:text-sm xl:text-xl  2xl:space-x-14  text-lg font-lato font-bold flex-row pr-10">
                    <Link to= {""}><li className='cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 hover:cursor-pointer flex items-center gap-2.5'><FaCartShopping /><span>CARRITO</span></li></Link>
                    <Link to= {"login"}><li className='cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 hover:cursor-pointer flex items-center gap-2.5'><FaRegCircleUser /> <span>INGRESAR</span></li></Link>
                   
                </ul>
                {mostrarMenu && <MenuMob onClose={abrirMenu} />}
            </nav>
        </header>
    )
}
export default NavBar



