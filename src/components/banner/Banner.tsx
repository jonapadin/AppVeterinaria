interface BannerProps {
    banner: string;
    imagen?: string;
    textoPrincipal: string;
    textoSecundario: string;
    enlace: string;
    botonTexto: string;
}

function BannerPrincipal({ banner, imagen, textoPrincipal, textoSecundario, enlace, botonTexto}: BannerProps) {
    return (
        <div className="relative flex items-center justify-between w-[60%] h-[200px] mt-6" style={{ backgroundImage: `url(${banner})` }}>
            <div className="flex flex-row items-center justify-baseline text-center">
                <div className="flex flex-col items-center text-center">
                    <p className="pl-20 text-5xl font-bold text-white">{textoPrincipal}</p>
                    <small className="px-4 text-white text-2xl">{textoSecundario}</small><br />
                    <a href={enlace} className="rounded bg-[#8F108D] p-2 text-white hover:bg-[#541d55]">{botonTexto}</a>
                </div>
                {imagen && <img src={imagen} alt="Banner" className="absolute right-4 bottom-0 pr-4" />}
            </div>
        </div>
    );
}
export default BannerPrincipal;