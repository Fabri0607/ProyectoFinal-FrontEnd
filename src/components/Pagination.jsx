import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generate page numbers to display (e.g., 1, 2, 3, ..., 10)
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-600">
        Mostrando {(currentPage - 1) * itemsPerPage + 1}-
        {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        >
          Anterior
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-lg ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Pagination;