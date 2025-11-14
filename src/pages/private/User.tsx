import BannerPrincipal from "../../components/banner/Banner";
import BannerChat from "../../components/banner/BannerChat";
import Service from "../../components/card/Servicios";
import Footer from "../../components/footer/Footer"
import NavBar from "../../components/navbar/NavBar"


function User(){
    return (
        <>
            <NavBar />
            <main className="flex flex-col items-center justify-center">
            <BannerPrincipal
                banner="public/assets/img/BannerHome2.jpg"
                />

            <Service servicios={[
            { imagen: "public/assets/img/vacunacion.png", titulo: "Vacunación", url: "turnos.html" },
            { imagen: "public/assets/img/hospitalizacion.png", titulo: "Hospitalización", url: "turnos.html" },
            { imagen: "public/assets/img/historiaclinica.png", titulo: "Historia Clínica", url: "historiaClinica.html" },
            { imagen: "public/assets/img/productos 1.png", titulo: "Productos", url: "productos.html" }
            ]}/>
            <BannerChat
                banner="public/assets/img/bannerHome.jpg"
                />
            </main>
            <Footer />
        </>
    )
}
export default User;