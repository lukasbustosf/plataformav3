'use client'

import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  ChevronUpDownIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'

interface Column {
  key: string
  label: string
  sortable?: boolean
  className?: string
  render?: (value: any, row: any) => ReactNode
  mobileLabel?: string // Custom label for mobile view
  hiddenOnMobile?: boolean // Hide this column on mobile
}

interface ResponsiveTableProps {
  columns: Column[]
  data: any[]
  keyExtractor?: (row: any, index: number) => string
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  sortable?: boolean
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  emptyMessage?: string
  loading?: boolean
  loadingRows?: number
  className?: string
  cardClassName?: string
  showPagination?: boolean
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  itemsPerPage?: number
}

type SortState = {
  key: string
  direction: 'asc' | 'desc'
} | null

export function ResponsiveTable({
  columns,
  data,
  keyExtractor = (row, index) => index.toString(),
  searchable = false,
  searchPlaceholder = "Buscar...",
  onSearch,
  sortable = false,
  onSort,
  emptyMessage = "No hay datos disponibles",
  loading = false,
  loadingRows = 5,
  className,
  cardClassName,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 10
}: ResponsiveTableProps) {
  const [sortState, setSortState] = useState<SortState>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSort = (key: string) => {
    if (!sortable) return
    
    let direction: 'asc' | 'desc' = 'asc'
    
    if (sortState?.key === key) {
      direction = sortState.direction === 'asc' ? 'desc' : 'asc'
    }
    
    setSortState({ key, direction })
    onSort?.(key, direction)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const getSortIcon = (columnKey: string) => {
    if (!sortable) return null
    
    if (sortState?.key !== columnKey) {
      return <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
    }
    
    return sortState.direction === 'asc' 
      ? <ChevronUpIcon className="h-4 w-4 text-gray-600" />
      : <ChevronDownIcon className="h-4 w-4 text-gray-600" />
  }

  const renderLoadingSkeleton = () => (
    <>
      {/* Desktop loading */}
      <table className="table-desktop min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: loadingRows }).map((_, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile loading */}
      <div className="table-mobile-card">
        {Array.from({ length: loadingRows }).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  )

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="text-gray-400">
        <AdjustmentsHorizontalIcon className="h-12 w-12 mx-auto mb-4" />
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">No hay datos</h3>
      <p className="text-sm text-gray-500">{emptyMessage}</p>
    </div>
  )

  const renderDesktopTable = () => (
    <table className="table-desktop min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={cn(
                "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                sortable && column.sortable !== false && "cursor-pointer hover:bg-gray-100",
                column.className
              )}
              onClick={() => column.sortable !== false && handleSort(column.key)}
            >
              <div className="flex items-center space-x-1">
                <span>{column.label}</span>
                {column.sortable !== false && getSortIcon(column.key)}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, index) => (
          <tr key={keyExtractor(row, index)} className="hover:bg-gray-50">
            {columns.map((column) => (
              <td key={column.key} className={cn("px-6 py-4 whitespace-nowrap text-sm", column.className)}>
                {column.render ? column.render(row[column.key], row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )

  const renderMobileCards = () => (
    <div className="table-mobile-card">
      {data.map((row, index) => (
        <div 
          key={keyExtractor(row, index)} 
          className={cn("bg-white p-4 rounded-lg shadow border border-gray-200", cardClassName)}
        >
          <div className="space-y-3">
            {columns
              .filter(column => !column.hiddenOnMobile)
              .map((column) => {
                const value = column.render ? column.render(row[column.key], row) : row[column.key]
                if (!value && value !== 0) return null
                
                return (
                  <div key={column.key} className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-500 min-w-0 flex-1">
                      {column.mobileLabel || column.label}:
                    </span>
                    <span className="text-sm text-gray-900 ml-2 text-right flex-1">
                      {value}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )

  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-t border-gray-200 bg-white">
        <div className="flex flex-1 justify-between items-center sm:hidden">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
            className="btn-secondary btn-responsive disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="btn-secondary btn-responsive disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando{' '}
              <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
              {' '}a{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, data.length)}
              </span>
              {' '}de{' '}
              <span className="font-medium">{data.length}</span>
              {' '}resultados
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage <= 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Anterior</span>
                <ChevronDownIcon className="h-5 w-5 rotate-90" />
              </button>
              
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={cn(
                    "relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0",
                    currentPage === page
                      ? "z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  )}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Siguiente</span>
                <ChevronDownIcon className="h-5 w-5 -rotate-90" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-white shadow-sm rounded-lg overflow-hidden", className)}>
      {/* Search bar */}
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field-mobile pl-10"
            />
          </div>
        </div>
      )}

      {/* Table content */}
      <div className="table-container">
        {loading ? (
          renderLoadingSkeleton()
        ) : data.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderDesktopTable()}
            {renderMobileCards()}
          </>
        )}
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  )
} 