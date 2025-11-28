import { Link } from "react-router-dom";
interface Service {
    imagen: string;
    titulo: string;
    url: string;    
}

function Service({ servicios }: { servicios: Service[] }) {
    return (
        <div className="flex flex-wrap flex-row justify-center gap-4 my-8">
            {servicios.map((servicio, index) => (
                <div className="relative text-center hover:cursor-pointer hover:brightness-80" key={index}>
                    <Link to={servicio.url} className="text-decoration-none">
                        <div className="position-relative">
                            <img src={servicio.imagen} alt={servicio.titulo} className="h-[180px] rounded-lg" />
                            <div className="absolute bottom-0 left-0 right-0 font-bold text-2xl text-white text-shadow-[1px 1px 4px rgba(0, 0, 0, 0.7)]">
                                {servicio.titulo}
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
export default Service;

