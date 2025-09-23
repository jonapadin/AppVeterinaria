import './navbar.css'
function NavBar() {
    return (
        <header>
            <nav className="contenido">
                <div className="izquierda">
                    < img src="../../assets/icons/patitaGatoPerroLogo 2.svg" alt="patitas" />
                    {/* Menú pc */}
                    <ul className="categoria">
                        <li>INICIO</li>
                        <li>PRODUCTOS</li>
                        <li>SERVICIOS</li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}
export default NavBar

