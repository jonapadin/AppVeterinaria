import MenuMob from './MenuMob';
import './navbar.css'
import { FiAlignJustify } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

function NavBar() {
    const [mostrarMenu, setMostrarMenu] = useState(false);

    const abrirMenu = () => {
        setMostrarMenu(!mostrarMenu);
    };
    return (

        <header>
            <nav className="flex justify-around p-4 bg-[#8F108D] text-white items-center">
                <button onClick={abrirMenu} className="block md:hidden p-2 bg-[#8F108D]"> <FiAlignJustify className=" w-12 h-8"/></button>
                {/* Logo */}
                <img src="../../assets/icons/patitaGatoPerroLogo 2.svg" alt="patitas" />

                {/* Input buscador (desktop) */}
                <div className="flex-1 justify-center px-4">
                    <div className="flex items-center border rounded overflow-hidden bg-white">
                        <input
                            className="flex-1 px-2 py-1 outline-none text-black w-[70px] md:w-[400px]"
                            type="search"
                            placeholder="Buscar"
                        />
                        <button className="p-2 bg-white border-l border-gray-600">
                            <FaSearch className="text-gray-600 " />
                        </button>
                    </div>
                </div>
                {/* Menú */}
                <ul className="hidden md:flex ">
                    <li>INICIO</li>
                    <li>PRODUCTOS</li>
                    <li>SERVICIOS</li>
                </ul>
                {mostrarMenu && <MenuMob onClose={abrirMenu} />}
            </nav>
        </header>
    )
}
export default NavBar



