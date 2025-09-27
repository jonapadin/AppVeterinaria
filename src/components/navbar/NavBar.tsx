import MenuMob from './MenuMob';
import './navbar.css'

import { useState } from "react";

function NavBar() {
    const [mostrarMenu, setMostrarMenu] = useState(false);

    const abrirMenu = () => {
        setMostrarMenu(!mostrarMenu);
    };
    return (

        <header>
            <nav className="flex justify-around p-4 bg-[#8F108D] text-white">
               <img onClick={abrirMenu} className="block md:hidden p-2 bg-amber-900" src='../'></img>
                    < img src="../../assets/icons/patitaGatoPerroLogo 2.svg" alt="patitas" />
                    <ul className="categoria">
                        <li>INICIO</li>
                        <li>PRODUCTOS</li>
                        <li>SERVICIOS</li>
                    </ul>
                    {
                        mostrarMenu ? <MenuMob /> : null
                    }
            </nav>
        </header>
    )
}
export default NavBar



