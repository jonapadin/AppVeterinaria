function User() {
    return (
        <>
            <main className="w-full flex flex-col items-center pt-16 md:pt-16 ">

                {/* -------------------- BANNER PRINCIPAL -------------------- */}
                <section className="w-full ">
                    <div className="h-[280px] sm:h-[250px] md:h-[300px] lg:h-[500px] overflow-hidden">
                        <img
                            src="/public/assets/img/bannerHome.png"
                            alt="banner"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                </section>

                {/* -------------------- SERVICIOS (ESTILO IGUAL AL EJEMPLO) ----------- */}
                <h2 className="text-center text-4xl font-extrabold text-[#8F108D] my-12">
                    NUESTROS SERVICIOS CLAVES
                </h2> 
                <section className="w-full max-w-6xl pb-20 px-4 flex  justify-center gap-9">
                    {[
                        { img: "/public/assets/img/vacunacion.png", title: "Vacunación", url: "/turnos" },
                        { img: "/public/assets/img/hospitalizacion.png", title: "Turnos", url: "/turnos" },
                        { img: "/public/assets/img/historiaclinica.png", title: "Historia Clínica", url: "/historia-clinica" },
                        { img: "/public/assets/img/productos 1.png", title: "Productos", url: "/categoria" }
                    ].map((s, i) => (
                        <a
                            key={i}
                            href={s.url}
                            className="relative hover:brightness-90 transition rounded-lg duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <div className="relative">
                                {/* Imagen EXACTAMENTE igual al otro componente */}
                                <img
                                    src={s.img}
                                    alt={s.title}
                                    className="h-[180px] w-[260px] sm:w-[300px] md:w-[350px] transition rounded-lg object-cover"
                                />

                                {/* Texto superpuesto */}
                                <div className="absolute bottom-2 left-0 right-0 text-center font-bold text-white text-xl drop-shadow-[2px_2px_4px_rgba(0,0,0,0.7)]">
                                    {s.title}
                                </div>
                            </div>
                        </a>
                    ))}
                </section>

                {/* -------------------- BANNER CHAT ------------------------- */}
                <section className="w-full">
                    <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[500px] overflow-hidden">

                        {/* Imagen del banner */}
                        <img
                            src="/public/assets/img/bannerHome2.png"
                            alt="banner"
                            className="w-full h-full object-cover object-center"
                        />

                        {/* Botón posicionado sobre la imagen */}
                        <button
                            className="absolute text-amber-50 bottom-20 left-1/2 -translate-x-2/2 
                 text-lg font-bold py-4 px-10 rounded-full 
                 bg-fuchsia-700 hover:bg-fuchsia-900
                 transition-all duration-300 transform hover:scale-105 shadow-xl"
                        >
                            Chateá con nosotros
                        </button>

                    </div>
                </section>


            </main>
        </>
    );
}

export default User;
