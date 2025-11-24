function User() {
    return (
        <>
            <main className="w-full flex flex-col items-center pt-16 md:pt-16">

                {/* -------------------- BANNER PRINCIPAL -------------------- */}
                <section className="">
                    <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[500px] ">
                        <img
                            src="/public/assets/img/bannerHome.png"
                            alt="banner"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                </section>

                {/* -------------------- SERVICIOS (ESTILO IGUAL AL EJEMPLO) ----------- */}
                <section className="w-full max-w-6xl py-10 px-4 flex  justify-center gap-6">
                    {[
                        { img: "/public/assets/img/vacunacion.png", title: "Vacunación", url: "/turnos" },
                        { img: "/public/assets/img/hospitalizacion.png", title: "Hospitalización", url: "/turnos" },
                        { img: "/public/assets/img/historiaclinica.png", title: "Historia Clínica", url: "/historia-clinica" },
                        { img: "/public/assets/img/productos 1.png", title: "Productos", url: "/categoria" }
                    ].map((s, i) => (
                        <a
                            key={i}
                            href={s.url}
                            className="relative hover:brightness-90 transition rounded-lg"
                        >
                            <div className="relative">
                                {/* Imagen EXACTAMENTE igual al otro componente */}
                                <img
                                    src={s.img}
                                    alt={s.title}
                                    className="h-[180px] w-[260px] sm:w-[300px] md:w-[350px] rounded-lg object-cover"
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
                <section >
                    <div className=" sm:h-[220px] md:h-[280px] lg:h-[350px] overflow-hidden mt-6">
                        <img
                            src="/public/assets/img/bannerHome.jpg"
                            alt="banner chat"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                </section>

            </main>
        </>
    );
}

export default User;
