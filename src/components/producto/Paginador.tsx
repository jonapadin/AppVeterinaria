import React from 'react';
import type { JSX } from 'react/jsx-runtime';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; // Función que recibe el número de página como argumento
}

// Define la interfaz (tipo) para las props del componente Paginator
interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// El componente funcional usa React.FC (Functional Component) y recibe las props tipadas
const Paginator: React.FC<PaginatorProps> = ({ currentPage, totalPages, onPageChange }) => {
    
    // Función auxiliar para renderizar los números de página (la lógica es la misma)
    const getPageNumbers = (): Array<number | '...'> => {
        const pages: Array<number | '...'> = [];
        const maxVisible = 5; 

        // Lógica simplificada para mostrar el rango de páginas (omito el cuerpo para no repetir)
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, currentPage + 2);

            if (currentPage < 3) {
                end = maxVisible;
            } else if (currentPage > totalPages - 2) {
                start = totalPages - maxVisible + 1;
            }

            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages) {
                if (end < totalPages - 1) pages.push('...');
                pages.push(totalPages);
            }
        }
        // Fin de la lógica
        
        return pages;
    };

    const renderPageButton = (page: number | '...'): JSX.Element => {
        if (page === '...') {
            return (
                <span key={`dots-${Math.random()}`} className="px-3 py-2 text-gray-600">
                    ...
                </span>
            );
        }

        const isActive = page === currentPage;
        const baseClasses = 'px-4 py-2 mx-1 border rounded-md transition duration-150 ease-in-out font-semibold';
        
        // Estilos para el estado Activo (Morado Oscuro)
        const activeClasses = 'bg-[#8F108D] text-white border-[#8F108D] shadow-md';
        
        // Estilos para Inactivo (Borde Gris, Hover Turquesa)
        const inactiveClasses = 'bg-white text-gray-700 border-gray-300 hover:text-[#8F108D]  hover:border-[#8F108D]';

        return (
            <button
                key={page}
                // El tipado asegura que 'page' es un número antes de pasarlo a onPageChange
                onClick={() => onPageChange(page)} 
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                disabled={isActive}
            >
                {page}
            </button>
        );
    };

    return (
        <div className="flex justify-center items-center my-8">
            {/* Botón Anterior */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 mx-1 text-[#8F108D]  disabled:text-gray-400 hover:text-gray-400 transition"
            >
                {'< Anterior'}
            </button>

            {/* Números de Página */}
            {getPageNumbers().map(renderPageButton)}

            {/* Botón Siguiente */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 mx-1 text-[#8F108D]  disabled:text-gray-400 hover:text-gray-400 transition"
            >
                {'Siguiente >'}
            </button>
        </div>
    );
};

export default Paginator;