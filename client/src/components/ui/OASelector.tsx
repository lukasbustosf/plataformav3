'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Filter, ChevronDown, ChevronUp, Book, Target } from 'lucide-react';

interface OA {
  oa_id: string;
  oa_code: string;
  oa_desc: string;
  oa_short_desc?: string;
  bloom_level: string;
  semester: number;
  complexity_level: number;
  estimated_hours: number;
  grade_code: string;
  subject_id: string;
  grade_levels?: { grade_name: string };
  subjects?: { subject_name: string; subject_color: string };
}

interface Grade {
  grade_code: string;
  grade_name: string;
  level_type: string;
}

interface Subject {
  subject_id: string;
  subject_code: string;
  subject_name: string;
  subject_color: string;
  department: string;
}

interface OASelectorProps {
  selectedOAs: string[];
  onOAChange: (oaCodes: string[]) => void;
  gradeCode?: string;
  subjectId?: string;
  className?: string;
}

const OASelector: React.FC<OASelectorProps> = ({
  selectedOAs,
  onOAChange,
  gradeCode,
  subjectId,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oas, setOAs] = useState<OA[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [selectedGrade, setSelectedGrade] = useState(gradeCode || '');
  const [selectedSubject, setSelectedSubject] = useState(subjectId || '');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedBloom, setSelectedBloom] = useState('');

  const bloomLevels = [
    'Recordar', 'Comprender', 'Aplicar', 'Analizar', 'Evaluar', 'Crear'
  ];

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Buscar OAs cuando cambien los filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchOAs();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedGrade, selectedSubject, selectedSemester, selectedBloom]);

  const loadInitialData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Cargar grados y materias en paralelo
      const [gradesRes, subjectsRes] = await Promise.all([
        fetch('/api/oa/grades', { headers }),
        fetch('/api/oa/subjects', { headers })
      ]);

      if (gradesRes.ok) {
        const gradesData = await gradesRes.json();
        setGrades(gradesData.data || []);
      }

      if (subjectsRes.ok) {
        const subjectsData = await subjectsRes.json();
        setSubjects(subjectsData.data || []);
      }

    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const searchOAs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      if (selectedGrade) params.set('grade_code', selectedGrade);
      if (selectedSubject) params.set('subject_id', selectedSubject);
      if (selectedSemester) params.set('semester', selectedSemester);
      if (selectedBloom) params.set('bloom_level', selectedBloom);
      params.set('limit', '50');

      const response = await fetch(`/api/oa/search?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setOAs(data.data.oas || []);
      } else {
        console.error('Error searching OAs:', response.statusText);
      }
    } catch (error) {
      console.error('Error searching OAs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOA = (oaCode: string) => {
    const newSelected = selectedOAs.includes(oaCode)
      ? selectedOAs.filter(code => code !== oaCode)
      : [...selectedOAs, oaCode];
    
    onOAChange(newSelected);
  };

  const removeOA = (oaCode: string) => {
    onOAChange(selectedOAs.filter(code => code !== oaCode));
  };

  const clearFilters = () => {
    setSelectedGrade(gradeCode || '');
    setSelectedSubject(subjectId || '');
    setSelectedSemester('');
    setSelectedBloom('');
    setSearchTerm('');
  };

  const filteredOAs = useMemo(() => {
    return oas.filter(oa => !selectedOAs.includes(oa.oa_code));
  }, [oas, selectedOAs]);

  const hasActiveFilters = selectedGrade || selectedSubject || selectedSemester || selectedBloom || searchTerm;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selected OAs */}
      {selectedOAs.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            OAs Seleccionados ({selectedOAs.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedOAs.map((oaCode) => {
              const oa = oas.find(o => o.oa_code === oaCode);
              return (
                <div
                  key={oaCode}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <Target size={14} />
                  <span className="font-medium">{oaCode}</span>
                  {oa && (
                    <span className="text-blue-600 text-xs max-w-32 truncate">
                      {oa.oa_short_desc || oa.oa_desc}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeOA(oaCode)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Buscar Objetivos de Aprendizaje
        </label>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, descripción o palabras clave..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onFocus={() => setIsOpen(true)}
          />
        </div>

        {/* Filters Toggle */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <Filter size={16} />
            Filtros avanzados
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Grado
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="">Todos los grados</option>
                {grades.map((grade) => (
                  <option key={grade.grade_code} value={grade.grade_code}>
                    {grade.grade_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Materia
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="">Todas las materias</option>
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.subject_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Semestre
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="">Todos</option>
                <option value="1">Primer Semestre</option>
                <option value="2">Segundo Semestre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nivel Bloom
              </label>
              <select
                value={selectedBloom}
                onChange={(e) => setSelectedBloom(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="">Todos los niveles</option>
                {bloomLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {(isOpen || searchTerm || hasActiveFilters) && (
        <div className="border border-gray-300 rounded-lg max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              Buscando objetivos de aprendizaje...
            </div>
          ) : filteredOAs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredOAs.map((oa) => (
                <div
                  key={oa.oa_id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleOA(oa.oa_code)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-blue-600">
                          {oa.oa_code}
                        </span>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                          {oa.bloom_level}
                        </span>
                        {oa.subjects?.subject_color && (
                          <span 
                            className="text-xs px-2 py-1 rounded text-white"
                            style={{ backgroundColor: oa.subjects.subject_color }}
                          >
                            {oa.subjects.subject_name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {oa.oa_short_desc || oa.oa_desc}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>📚 {oa.grade_levels?.grade_name}</span>
                        <span>📅 Semestre {oa.semester}</span>
                        <span>⭐ Nivel {oa.complexity_level}</span>
                        <span>⏰ {oa.estimated_hours}h</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Book className="text-gray-400" size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              {searchTerm || hasActiveFilters 
                ? 'No se encontraron objetivos de aprendizaje con los filtros actuales'
                : 'Comienza a escribir para buscar objetivos de aprendizaje'
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OASelector; 