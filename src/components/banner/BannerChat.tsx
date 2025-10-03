interface BannerProps {
    banner: string;
    imagen?: string;
    textoPrincipal: string;
    textoSecundario: string;
    enlace: string;
    botonTexto: string;
}

function BannerChat({ banner, textoPrincipal, textoSecundario, enlace, botonTexto}: BannerProps) {
    return (
        <div className="flex items-center justify-between w-[60%] h-[300px] my-6 bg-cover" style={{ backgroundImage: `url(${banner})` }}>
            <div className="flex flex-row items-center justify-baseline text-center">
                <div className="flex flex-col items-center text-center">
                    <p className="pl-0 pt-8 text-4xl font-bold text-white">{textoPrincipal}</p>
                    <p className="pt-10 pl-20 font-bold text-white text-5xl">{textoSecundario}</p><br />
                    <div className="pt-8">
                    <a href={enlace} className="rounded bg-[#8F108D] px-4 py-3 text-white hover:bg-[#541d55]">{botonTexto}</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BannerChat;