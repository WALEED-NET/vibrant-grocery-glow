
import React from 'react';
import { cn } from '@/lib/utils';

interface BootstrapPaginationProps {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  onPageChanged: (page: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChanged?: (pageSize: number) => void;
}

const BootstrapPagination = ({
  currentPage,
  pageSize,
  totalRecords,
  onPageChanged,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChanged
}: BootstrapPaginationProps) => {
  const totalPages = Math.ceil(totalRecords / pageSize);
  
  // Calculate which page numbers to display (show up to 5 page numbers)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    // Logic to show appropriate page numbers with ellipsis
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Start calculations for selective page display
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      // Adjust if we're at the end
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (onPageSizeChanged) {
      onPageSizeChanged(newSize);
    }
  };
  
  return (
    <div className="pagination-container py-4 px-6 mt-6 border-t border-gray-200 bg-gray-50">
      {/* Total records display */}
      <div className="total-records mb-3 text-sm text-gray-600 text-center">
        إجمالي العناصر: {totalRecords}
      </div>
      
      <nav aria-label="Page navigation" dir="ltr">
        <ul className="pagination justify-content-center mb-3">
          {/* First page button */}
          <li className={cn("page-item", { "disabled": currentPage === 1 })}>
            <button 
              className="page-link" 
              onClick={() => onPageChanged(1)} 
              disabled={currentPage === 1}
              aria-label="First Page"
              title="الصفحة الأولى"
            >
              &laquo;
            </button>
          </li>
          
          {/* Previous page button */}
          <li className={cn("page-item", { "disabled": currentPage === 1 })}>
            <button 
              className="page-link" 
              onClick={() => onPageChanged(currentPage - 1)} 
              disabled={currentPage === 1}
              aria-label="Previous Page"
              title="الصفحة السابقة"
            >
              &lsaquo;
            </button>
          </li>
          
          {/* Page numbers */}
          {getPageNumbers().map(page => (
            <li key={page} className={cn("page-item", { "active": page === currentPage })}>
              <button 
                className="page-link" 
                onClick={() => onPageChanged(page)}
              >
                {page}
              </button>
            </li>
          ))}
          
          {/* Next page button */}
          <li className={cn("page-item", { "disabled": currentPage === totalPages })}>
            <button 
              className="page-link" 
              onClick={() => onPageChanged(currentPage + 1)} 
              disabled={currentPage === totalPages}
              aria-label="Next Page"
              title="الصفحة التالية"
            >
              &rsaquo;
            </button>
          </li>
          
          {/* Last page button */}
          <li className={cn("page-item", { "disabled": currentPage === totalPages })}>
            <button 
              className="page-link" 
              onClick={() => onPageChanged(totalPages)} 
              disabled={currentPage === totalPages}
              aria-label="Last Page"
              title="الصفحة الأخيرة"
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
      
      {/* Page size selector */}
      {onPageSizeChanged && (
        <div className="page-size-selector flex items-center justify-center gap-2">
          <span className="text-sm">عدد العناصر:</span>
          <select 
            className="form-select py-1 px-2 text-sm border rounded bg-white"
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: '80px' }}
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default BootstrapPagination;
