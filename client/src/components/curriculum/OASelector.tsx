'use client'

import React, { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  CheckIcon,
  FunnelIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline'

// ===============================================
// P1 OA SELECTOR COMPONENT
// ===============================================

interface OAOption {
  oa_id: string
  oa_code: string
  oa_desc: string
  oa_short_desc?: string
  bloom_level: string
  grade_code: string
  subject_id: string
  ministerial_priority: 'high' | 'normal' | 'low'
  complexity_level?: number
  estimated_hours?: number
  is_transversal: boolean
  subjects?: {
    subject_name: string
    subject_code: string
  }
  grade_levels?: {
    grade_name: string
  }
}

interface BloomLevel {
  level: string
  order: number
  description: string
  color: string
}

interface LearningObjective {
  oa_id: string
  oa_code: string
  oa_desc: string
  grade_code: string
  subject_id: string
  subject_name: string
  bloom_level: string
}

interface OASelectorProps {
  // Selection Props
  selectedOAs: string[]
  onSelectionChange: (selectedIds: string[]) => void
  maxSelection?: number
  
  // Filter Props
  gradeCode?: string
  subjectId?: string
  bloomLevels?: string[]
  priorityFilter?: ('high' | 'normal' | 'low')[]
  
  // UI Props
  placeholder?: string
  showClearAll?: boolean
  showSelectAll?: boolean
  showFilters?: boolean
  compactMode?: boolean
  
  // Validation Props
  required?: boolean
  minSelection?: number
  
  // P1 Features
  showCoverage?: boolean
  showBloomDistribution?: boolean
  prioritizeHigh?: boolean
}

export function OASelector({ 
  gradeCode, 
  subjectId, 
  selectedOAs,
  onSelectionChange,
  maxSelection = 20 
}: OASelectorProps) {
  const [availableOAs, setAvailableOAs] = useState<LearningObjective[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [bloomFilter, setBloomFilter] = useState<string>('')

  useEffect(() => {
    if (gradeCode && subjectId) {
      fetchOAs()
    }
  }, [gradeCode, subjectId])

  const fetchOAs = async () => {
    setLoading(true)
    try {
      // Mock data for now - replace with actual API call
      const defaultGrade = gradeCode || '5B'
      const defaultSubject = subjectId || 'MAT'
      
      const mockOAs: LearningObjective[] = [
        {
          oa_id: '1',
          oa_code: 'MA05-OA-01',
          oa_desc: 'Representar y describir números del 0 al 20',
          grade_code: defaultGrade,
          subject_id: defaultSubject,
          subject_name: 'Matemática',
          bloom_level: 'Recordar'
        },
        {
          oa_id: '2',
          oa_code: 'MA05-OA-02',
          oa_desc: 'Comparar y ordenar números del 0 al 20',
          grade_code: defaultGrade,
          subject_id: defaultSubject,
          subject_name: 'Matemática',
          bloom_level: 'Comprender'
        },
        {
          oa_id: '3',
          oa_code: 'MA05-OA-03',
          oa_desc: 'Identificar el orden de los elementos de una serie',
          grade_code: defaultGrade,
          subject_id: defaultSubject,
          subject_name: 'Matemática',
          bloom_level: 'Aplicar'
        },
        {
          oa_id: '4',
          oa_code: 'MA05-OA-04',
          oa_desc: 'Sumar y restar números del 0 al 20',
          grade_code: defaultGrade,
          subject_id: defaultSubject,
          subject_name: 'Matemática',
          bloom_level: 'Aplicar'
        },
        {
          oa_id: '5',
          oa_code: 'MA05-OA-05',
          oa_desc: 'Resolver problemas simples de adición y sustracción',
          grade_code: defaultGrade,
          subject_id: defaultSubject,
          subject_name: 'Matemática',
          bloom_level: 'Analizar'
        }
      ]
      
      setAvailableOAs(mockOAs)
    } catch (error) {
      console.error('Error fetching OAs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOAs = availableOAs.filter(oa => {
    const matchesSearch = oa.oa_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         oa.oa_desc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBloom = !bloomFilter || oa.bloom_level === bloomFilter
    return matchesSearch && matchesBloom
  })

  const isSelected = (oaId: string) => selectedOAs.includes(oaId)
  const canSelectMore = selectedOAs.length < maxSelection

  const handleOAToggle = (oa: LearningObjective) => {
    if (isSelected(oa.oa_id)) {
      onSelectionChange(selectedOAs.filter(id => id !== oa.oa_id))
    } else if (canSelectMore) {
      onSelectionChange([...selectedOAs, oa.oa_id])
    }
  }

  const getBloomColor = (level: string) => {
    switch (level) {
      case 'Recordar': return 'bg-blue-100 text-blue-800'
      case 'Comprender': return 'bg-green-100 text-green-800'
      case 'Aplicar': return 'bg-yellow-100 text-yellow-800'
      case 'Analizar': return 'bg-orange-100 text-orange-800'
      case 'Evaluar': return 'bg-red-100 text-red-800'
      case 'Crear': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AcademicCapIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Objetivos de Aprendizaje
          </h3>
          <span className="text-sm text-gray-500">
            ({selectedOAs.length}/{maxSelection})
          </span>
        </div>
        
        {selectedOAs.length >= maxSelection && (
          <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Límite alcanzado
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por código o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <select
          value={bloomFilter}
          onChange={(e) => setBloomFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos los niveles Bloom</option>
          <option value="Recordar">Recordar</option>
          <option value="Comprender">Comprender</option>
          <option value="Aplicar">Aplicar</option>
          <option value="Analizar">Analizar</option>
          <option value="Evaluar">Evaluar</option>
          <option value="Crear">Crear</option>
        </select>
      </div>

      {/* OA List */}
      <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Cargando objetivos...</p>
          </div>
        ) : filteredOAs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <AcademicCapIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron objetivos de aprendizaje</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredOAs.map((oa) => (
              <div
                key={oa.oa_id}
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected(oa.oa_id) 
                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-50'
                } ${!canSelectMore && !isSelected(oa.oa_id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleOAToggle(oa)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {oa.oa_code}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getBloomColor(oa.bloom_level)}`}>
                        {oa.bloom_level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {oa.oa_desc}
                    </p>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    {isSelected(oa.oa_id) ? (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected OAs Summary */}
      {selectedOAs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-blue-900">
              Objetivos Seleccionados ({selectedOAs.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedOAs.slice(0, 6).map(oaId => {
              const oa = availableOAs.find(o => o.oa_id === oaId)
              return oa ? (
                <div
                  key={oaId}
                  className="inline-flex items-center bg-white border border-blue-200 rounded-full px-3 py-1"
                >
                  <span className="text-xs text-blue-800">{oa.oa_code}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectionChange(selectedOAs.filter(id => id !== oaId))
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ) : null
            })}
            {selectedOAs.length > 6 && (
              <span className="text-xs text-blue-600 bg-white px-2 py-1 rounded-full border border-blue-200">
                +{selectedOAs.length - 6} más
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 

export default OASelector 