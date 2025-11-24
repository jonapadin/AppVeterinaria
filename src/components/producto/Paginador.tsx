import React from 'react';
import type { JSX } from 'react/jsx-runtime';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({ currentPage, totalPages, onPageChange }) => {
    
    const getPageNumbers = (): Array<number | '...'> => {
        const pages: Array<number | '...'> = [];
        const maxVisible = 5; 

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
        
        return pages;
    };

    const renderPageButton = (page: number | '...'): JSX.Element => {
        if (page === '...') {
            return (
                <span
                    key={`dots-${Math.random()}`}
                    className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm md:text-base text-gray-600"
                >
                    ...
                </span>
            );
        }

        const isActive = page === currentPage;
        const baseClasses =
            "font-semibold border rounded-md transition duration-150 ease-in-out";

        const activeClasses = "bg-[#8F108D] text-white border-[#8F108D] shadow-md";
        const inactiveClasses =
            "bg-white text-gray-700 border-gray-300 hover:text-[#8F108D] hover:border-[#8F108D]";

        return (
            <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={isActive}
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
                gap-1 sm:gap-2 md:gap-3
                my-8 
                mb-20 md:mb-8     /* 🔥 más espacio abajo en móvil */
                overflow-x-auto 
                px-2
            "
        >

            {/* Botón Anterior */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="
                    mx-1 
                    text-xs sm:text-sm md:text-base 
                    px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2
                    text-[#8F108D] disabled:text-gray-400 hover:text-gray-400 transition
                "
            >
                {'< Anterior'}
            </button>

            {/* Números */}
            {getPageNumbers().map(renderPageButton)}

            {/* Botón Siguiente */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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
