function User() {
    return (
        <>
            <main className="w-full flex flex-col items-center pt-16  ">

                {/* -------------------- BANNER PRINCIPAL -------------------- */}
                <section className="w-full ">
                    <div className="h-[190px] md:h-[400px] lg:h-[500px] 2xl:h-[650px] banner overflow-hidden">
                        <img
                            src="/public/assets/img/bannerHome.png"
                            alt="banner"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                </section>

                {/* -------------------- SERVICIOS (ESTILO IGUAL AL EJEMPLO) ----------- */}
                <h2 className="text-center text-xl lg:text-4xl font-extrabold text-[#8F108D] my-12 ">
                    NUESTROS SERVICIOS CLAVES
                </h2>
                <section className="w-full max-w-6xl pb-20 px-4 gap-4 grid grid-cols-2 md:grid-cols-4 md:gap-5 lg:grid-cols-4 lg:gap-6 ">
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
                    <div className="relative w-full h-[180px] mb-20 xs:mb-20 md:-mb-2 sm:h-[300px] md:h-[400px] 2xl:h-[500px] 2xl:mb-0 overflow-hidden">

                        {/* Imagen del banner */}
                        <img
                            src="/public/assets/img/bannerHome2.png"
                            alt="banner"
                            className="w-full h-full object-center"
                        />

                        {/* Botón posicionado sobre la imagen */}
                        <button
                            className="absolute text-amber-50 justify-center 
                  font-bold  rounded-full bg-fuchsia-700 hover:bg-fuchsia-900 
                 transition-all duration-300 transform hover:scale-105 shadow-xl button
                 bottom-6 left-1/2 -translate-x-1/2 text-xs py-2 px-2
                 md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:py-4 md:px-4 md:text-lg 
                 lg:text-2xl lg:py-4 lg:px-6
                 2xl:bottom-16 2xl:left-1/2 2xl:-translate-x-1/2 2xl:py-5 2xl:px-8 2xl:text-2xl"
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
