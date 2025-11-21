import BannerPrincipal from "../../components/banner/Banner";
import BannerChat from "../../components/banner/BannerChat";
import Service from "../../components/card/Servicios";


function User(){
    return (
        <>
            <main className="flex flex-col items-center justify-center">
            <BannerPrincipal
                banner="public/assets/img/BannerHome2.jpg"
                />

            <Service servicios={[
            { imagen: "public/assets/img/vacunacion.png", titulo: "Vacunación", url: "turnos.html" },
            { imagen: "public/assets/img/hospitalizacion.png", titulo: "Hospitalización", url: "turnos.html" },
            { imagen: "public/assets/img/historiaclinica.png", titulo: "Historia Clínica", url: "historiaClinica.html" },
            { imagen: "public/assets/img/productos 1.png", titulo: "Productos", url: "/categoria" }
            ]}/>
            <BannerChat
                banner="public/assets/img/bannerHome.jpg"
                />
            </main>
        </>
    )
}
export default User;