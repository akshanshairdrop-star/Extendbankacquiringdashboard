import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp, MoreVertical, Search } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  hidden?: boolean;
}

export interface RowAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'danger' | 'warning';
  show?: (row: T) => boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowActions?: RowAction<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  rowKey: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  rowActions,
  searchable = false,
  searchPlaceholder = 'Search...',
  onRowClick,
  emptyState,
  rowKey,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuRow, setOpenMenuRow] = useState<string | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const visibleColumns = columns.filter(col => !hiddenColumns.includes(col.key));

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Simple search across all visible fields
  const filteredData = searchQuery
    ? data.filter(row =>
        Object.values(row as any).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data;

  // Sorting
  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const aVal = (a as any)[sortColumn];
        const bVal = (b as any)[sortColumn];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return sortDirection === 'asc' ? comparison : -comparison;
      })
    : filteredData;

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Search & Column Selector */}
      {searchable && (
        <div className="p-4 border-b border-[#e6e2e9]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#635c8a]" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b1b91] text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#fafafa] sticky top-0">
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider"
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-1 hover:text-[#4b1b91] transition-colors"
                    >
                      {column.label}
                      {sortColumn === column.key && (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              {rowActions && rowActions.length > 0 && (
                <th className="px-4 py-3 text-left text-xs font-medium text-[#635c8a] uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6e2e9]">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + (rowActions ? 1 : 0)} className="px-4 py-8">
                  {emptyState || (
                    <div className="text-center text-[#635c8a]">No data available</div>
                  )}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-[#fafafa] transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {visibleColumns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm">
                      {column.render ? column.render(row) : String((row as any)[column.key])}
                    </td>
                  ))}
                  {rowActions && rowActions.length > 0 && (
                    <td className="px-4 py-3 text-sm" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuRow(openMenuRow === rowKey(row) ? null : rowKey(row))}
                          className="p-1.5 hover:bg-[#f5effb] rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-[#635c8a]" />
                        </button>
                        
                        {openMenuRow === rowKey(row) && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuRow(null)}
                            />
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#e6e2e9] py-1 z-20">
                              {rowActions
                                .filter(action => !action.show || action.show(row))
                                .map((action, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      action.onClick(row);
                                      setOpenMenuRow(null);
                                    }}
                                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#fafafa] transition-colors ${
                                      action.variant === 'danger'
                                        ? 'text-[#d74242]'
                                        : action.variant === 'warning'
                                        ? 'text-[#f59f0a]'
                                        : 'text-[#1a1339]'
                                    }`}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </button>
                                ))}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#e6e2e9]">
          <div className="text-sm text-[#635c8a]">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-[#e6e2e9] rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded-lg text-sm ${
                    currentPage === page
                      ? 'bg-[#4b1b91] text-white border-[#4b1b91]'
                      : 'border-[#e6e2e9] hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-[#e6e2e9] rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}