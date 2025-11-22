function UserHome() {
    return (
        <>
            <main className="w-full flex flex-col items-center pt-16 md:pt-16">

                {/* -------------------- BANNER PRINCIPAL -------------------- */}
                <section className="w-full">
                    <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[700px] overflow-hidden">
                        <img
                            src="/public/assets/img/BannerHome2.jpg"
                            alt="banner"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                </section>

                {/* -------------------- SERVICIOS --------------------------- */}
                <section className="w-full max-w-6xl py-10 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { img: "/public/assets/img/vacunacion.png", title: "Vacunación", url: "/turnos" },
                        { img: "/public/assets/img/hospitalizacion.png", title: "Hospitalización", url: "/turnos" },
                        { img: "/public/assets/img/historiaclinica.png", title: "Historia Clínica", url: "/historia-clinica" },
                        { img: "/public/assets/img/productos 1.png", title: "Productos", url: "/categoria" }
                    ].map((s, i) => (
                        <a
                            key={i}
                            href={s.url}
                            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center 
                                       hover:scale-[1.03] transition cursor-pointer"
                        >
                            <img src={s.img} alt={s.title} className="w-24 h-24 object-contain mb-4" />
                            <p className="font-semibold text-center">{s.title}</p>
                        </a>
                    ))}
                </section>

                {/* -------------------- BANNER CHAT ------------------------- */}
                <section className="w-full">
                    <div className="h-[160px] sm:h-[220px] md:h-[280px] lg:h-[350px] overflow-hidden mt-6">
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

export default UserHome;
