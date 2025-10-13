interface Testimonio {
    imagenbackgroud:string;
    imagen:string;
    parrafo:string;
}
 function TestimonioLista ({Testimonios}: {Testimonios: Testimonio[]}) {
    return Testimonios
}
export default TestimonioLista;