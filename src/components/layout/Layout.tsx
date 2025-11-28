import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";
import NavBar from "../navbar/NavBar";
import { useState } from "react";
import Carrito from "../carrito/Carrito";
function Layout() {
  const [isCarritoOpen, setIsCarritoOpen] = useState(false);

  const onOpenCarrito = () => setIsCarritoOpen(true);
  const onCloseCarrito = () => setIsCarritoOpen(false);

  return (
    <>
      <NavBar onOpenCarrito={onOpenCarrito} />

      {/* Carrito Modal */}
      {isCarritoOpen && <Carrito onClose={onCloseCarrito} />}

      <main>
        <Outlet />
      </main>

      <Footer onOpenCarrito={onOpenCarrito} />
    </>
  );
}

export default Layout;
