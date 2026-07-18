const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}) => {
  /**
   * Generates an array of page numbers and ellipsis strings
   * to build a truncated layout (e.g., [1, 2, '...', 9, 10, 11, '...', 19, 20])
   */
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    // 1. Always anchor the first two pages
    pages.push(1);
    if (totalPages > 1) pages.push(2);

    // 2. Calculate a window of 1 page before and after the active page
    const start = Math.max(3, page - 1);
    const end = Math.min(totalPages - 2, page + 1);

    // 3. Insert leading ellipsis if there's a structural gap after page 2
    if (start > 3) {
      pages.push("...");
    }

    // 4. Generate the middle active structural block
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // 5. Insert trailing ellipsis if there's a structural gap before the final pages
    if (end < totalPages - 2) {
      pages.push("...");
    }

    // 6. Anchor the final two pages securely (checking for duplicates)
    if (totalPages > 3 && !pages.includes(totalPages - 1)) {
      pages.push(totalPages - 1);
    }
    if (totalPages > 2 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="pagination">
      {/* Navigation Control: Go to previous page */}
      <button
        className="pagination_button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>

      {/* Dynamic page numbers track mapper */}
      {getPageNumbers().map((num, index) => {
        // Render stylized text placeholder for breaks
        if (num === "...") {
          return (
            <span key={`ellipsis-${index}`} className="pagination_ellipsis">
              ...
            </span>
          );
        }

        // Render standard interactive page triggers
        return (
          <button
            // Appending the index to the key prevents conflicts if totalPages is very small
            key={`${num}-${index}`}
            className={`pagination_button ${page === num ? "active" : ""}`}
            onClick={() => onPageChange(num as number)}
          >
            {num}
          </button>
        );
      })}

      {/* Navigation Control: Go to next page */}
      <button
        className="pagination_button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
