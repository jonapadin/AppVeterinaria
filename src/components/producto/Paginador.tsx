import React from 'react';
import type { JSX } from 'react/jsx-runtime';

// Props que recibe el componente del paginador
interface PaginatorProps {
  currentPage: number;          // Página actual que se está mostrando
  totalPages: number;           // Cantidad total de páginas disponibles
  onPageChange: (page: number) => void;  // Función que se ejecuta cuando el usuario cambia de página
}
// React.FC<PaginatorProps significa que este componente RECEBE propiedades que deben coincidir con la interfaz PaginatorProps.
const Paginator: React.FC<PaginatorProps> = ({ currentPage, totalPages, onPageChange }) => {
    
    // Esta función calcula qué números de páginas mostrar en la paginación
    const getPageNumbers = (): Array<number | '...'> => {  
        const pages: Array<number | '...'> = [];
        const maxVisible = 2; // 🔹 Solo queremos mostrar 2 páginas visibles

        // 👉 Si hay pocas páginas, se muestran todas sin "..."
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {

            // 📌 Calcula un rango alrededor de la página actual
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, currentPage + 2);

            // 📌 Si estamos al principio, solo mostramos las primeras páginas
            if (currentPage < 3) {
                end = maxVisible;

            // 📌 Si estamos al final, mostramos las últimas páginas
            } else if (currentPage > totalPages - 2) {
                start = totalPages - maxVisible + 1;
            }

            // 📌 Si no empezamos desde la página 1, agregamos "1" y "..."
            if (start > 1) {
                pages.push(1);         // primera página
                if (start > 2) pages.push('...'); // puntos suspensivos
            }

            // 📌 Agrega las páginas visibles (ej: 4, 5)
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // 📌 Si el rango no termina en la última página, agregamos "..." y la última página
            if (end < totalPages) {
                if (end < totalPages - 1) pages.push('...'); 
                pages.push(totalPages);   // última página
            }
        }
        
        return pages; // Devuelve la lista final
    };

    //  Función que pinta cada botón de página
    const renderPageButton = (page: number | '...'): JSX.Element => {

        //  Si la página es "..." se muestra como texto, no botón
        if (page === '...') {
            return (
                <span
                    key={`dots-${Math.random()}`} // key único
                    className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm md:text-base text-gray-600"
                >
                    ...
                </span>
            );
        }

        // Verifica si esta página es la actual (para dejarla bloqueada y estilizada)
        const isActive = page === currentPage;

        const baseClasses =
            "font-semibold border rounded-md transition duration-150 ease-in-out";

        // Estilos para la página seleccionada
        const activeClasses = "bg-[#8F108D] text-white border-[#8F108D] shadow-md";

        // Estilos para páginas normales
        const inactiveClasses =
            "bg-white text-gray-700 border-gray-300 hover:text-[#8F108D] hover:border-[#8F108D]";

        // Render del botón de página
        return (
            <button
                key={page}
                onClick={() => onPageChange(page)} // Cambia la página al hacer clic
                disabled={isActive}               // Si es la actual, se desactiva
                className={`
                    ${baseClasses}
                    text-xs sm:text-sm md:text-base
                    px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2
                    ${isActive ? activeClasses : inactiveClasses}
                `}
            >
                {page}
            </button>
        );
    };

    return (
        <div
            className="
                flex flex-wrap justify-center items-center 
                gap-1 sm:gap-2 md:gap-3             /* Espaciado entre botones */
                my-8 
                mb-20 md:mb-8                       /* Más espacio abajo en móvil */
                overflow-x-auto                     /* Permite scroll si es muy ancho */
                px-2
            "
        >

            {/*  Botón "Anterior" */}
            <button
                onClick={() => onPageChange(currentPage - 1)} // Va a la página anterior
                disabled={currentPage === 1}                  // Desactivado en página 1
                className="
                    mx-1 
                    text-xs sm:text-sm md:text-base 
                    px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2
                    text-[#8F108D] disabled:text-gray-400 hover:text-gray-400 transition
                "
            >
                {'< Anterior'}
            </button>

            {/* Renderiza todos los números de páginas calculados */}
            {getPageNumbers().map(renderPageButton)}

            {/* Botón "Siguiente" */}
            <button
                onClick={() => onPageChange(currentPage + 1)}  // Va a la siguiente página
                disabled={currentPage === totalPages}          // Desactivado en la última
                className="
                    mx-1 
                    text-xs sm:text-sm md:text-base 
                    px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2
                    text-[#8F108D] disabled:text-gray-400 hover:text-gray-400 transition
                "
            >
                {'Siguiente >'}
            </button>

        </div>
    );
};

export default Paginator;
