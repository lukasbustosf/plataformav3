'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FireIcon, PaintBrushIcon, AdjustmentsHorizontalIcon, EyeIcon, CogIcon, SparklesIcon } from '@heroicons/react/24/solid';

// 🎨 Tipos para el sistema de skins
interface Skin {
  id: string;
  engine_id: string;
  name: string;
  description: string;
  category: string;
  subject: string;
  grades: string[];
  theme: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    background: string;
    font_family: string;
    animations: string;
  };
  elements: any;
  engine_config: any;
  preview_url: string;
  active: boolean;
  created_at: string;
}

interface SkinStats {
  total_skins: number;
  by_engine: Record<string, number>;
  by_subject: Record<string, number>;
  by_category: Record<string, number>;
  engines_covered: string[];
  subjects_covered: string[];
}

// 🎮 Tipo para sesiones demo
interface DemoSession {
  session_id: string;
  title: string;
  join_code: string;
  quiz_id: string;
  engine_id?: string;
}

const SkinManagementPage = () => {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [stats, setStats] = useState<SkinStats | null>(null);
  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEngine, setSelectedEngine] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewSkin, setPreviewSkin] = useState<Skin | null>(null);
  const [showApplyModal, setShowApplyModal] = useState<{skin: Skin | null, show: boolean}>({skin: null, show: false});
  const [applying, setApplying] = useState(false);

  // 🎮 Información de engines
  const engineInfo = {
    'ENG01': { name: 'Counter/Number Line', icon: '🧮', color: 'bg-blue-500' },
    'ENG02': { name: 'Drag-Drop Numbers', icon: '🔄', color: 'bg-green-500' },
    'ENG05': { name: 'Text Recognition', icon: '📝', color: 'bg-purple-500' },
    'ENG06': { name: 'Letter-Sound Matching', icon: '🔤', color: 'bg-pink-500' },
    'ENG07': { name: 'Reading Fluency', icon: '📚', color: 'bg-indigo-500' },
    'ENG09': { name: 'Life Cycle Simulator', icon: '🌱', color: 'bg-emerald-500' }
  };

  // 🎨 Categorías de skins
  const categoryInfo = {
    'space': { name: 'Espacial', icon: '🚀', color: 'bg-blue-600' },
    'animals': { name: 'Animales', icon: '🦁', color: 'bg-green-600' },
    'ocean': { name: 'Océano', icon: '🌊', color: 'bg-cyan-600' },
    'technology': { name: 'Tecnología', icon: '🤖', color: 'bg-purple-600' },
    'fantasy': { name: 'Fantasía', icon: '🏰', color: 'bg-pink-600' },
    'sports': { name: 'Deportes', icon: '⚽', color: 'bg-orange-600' },
    'food': { name: 'Comida', icon: '🍭', color: 'bg-yellow-600' },
    'science': { name: 'Ciencia', icon: '🧪', color: 'bg-teal-600' },
    'construction': { name: 'Construcción', icon: '🏗️', color: 'bg-red-600' },
    'music': { name: 'Música', icon: '🎵', color: 'bg-violet-600' },
    'adventure': { name: 'Aventura', icon: '🗺️', color: 'bg-amber-600' },
    'nature': { name: 'Naturaleza', icon: '🌿', color: 'bg-lime-600' }
  };

  // 📊 Cargar datos
  useEffect(() => {
    loadSkinsData();
    loadStats();
    loadDemoSessions();
  }, [selectedEngine, selectedSubject, selectedCategory]);

  const loadSkinsData = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedEngine !== 'all') params.append('engine', selectedEngine);
      if (selectedSubject !== 'all') params.append('subject', selectedSubject);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);

      const response = await fetch(`/api/skins?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setSkins(data.skins);
      }
    } catch (error) {
      console.error('Error loading skins:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/skins/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // 🎮 Cargar sesiones demo disponibles
  const loadDemoSessions = async () => {
    try {
      const response = await fetch('/api/game/demos');
      const data = await response.json();
      
      console.log('🎮 Demo sessions response:', data);
      
      if (data.sessions) {
        setDemoSessions(data.sessions);
        console.log(`🎮 Loaded ${data.sessions.length} demo sessions`);
      }
    } catch (error) {
      console.error('Error loading demo sessions:', error);
    }
  };

  // 🎨 Aplicar skin a una sesión demo
  const applySkinToDemo = async (skinId: string, sessionId: string) => {
    setApplying(true);
    try {
      const response = await fetch('/api/skins/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skin_id: skinId,
          game_session_id: sessionId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('🎉 ¡Skin aplicado exitosamente al demo!');
        setShowApplyModal({skin: null, show: false});
      } else {
        alert('❌ Error al aplicar skin: ' + (data.error?.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error applying skin:', error);
      alert('❌ Error de conexión al aplicar skin');
    } finally {
      setApplying(false);
    }
  };

  // 🔄 Duplicar skin (función placeholder)
  const duplicateSkin = async (skin: Skin) => {
    // Por ahora solo mostramos alerta - se puede implementar más tarde
    alert(`🔄 Funcionalidad de duplicar "${skin.name}" será implementada próximamente`);
  };

  // 🎨 Modal para aplicar skin a demo
  const ApplyToDemo = ({ skin }: { skin: Skin }) => {
    // Simplificar filtro - mostrar todas las sesiones demo por ahora
    const compatibleSessions = demoSessions;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Aplicar "{skin.name}" a Demo
              </h3>
              <button 
                onClick={() => setShowApplyModal({skin: null, show: false})}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Selecciona un demo para aplicar este skin. Total disponibles: {demoSessions.length}
            </p>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {compatibleSessions.map((session) => (
                <div 
                  key={session.session_id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{session.title}</p>
                    <p className="text-sm text-gray-500">
                      Código: {session.join_code} • ID: {session.session_id}
                    </p>
                    {session.quiz_id && (
                      <p className="text-xs text-blue-600">Quiz: {session.quiz_id}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => applySkinToDemo(skin.id, session.session_id)}
                    disabled={applying}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {applying ? 'Aplicando...' : 'Aplicar'}
                  </button>
                </div>
              ))}
            </div>
            
            {compatibleSessions.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">No hay demos disponibles</p>
                <p className="text-xs text-gray-400 mt-2">
                  Sesiones cargadas: {demoSessions.length} | 
                  Skin engine: {skin.engine_id}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 🎨 Componente de preview de skin
  const SkinPreview = ({ skin }: { skin: Skin }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{skin.name}</h3>
            <button 
              onClick={() => setPreviewSkin(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          {/* Preview visual */}
          <div 
            className="w-full h-48 rounded-lg mb-4 flex items-center justify-center text-white text-lg font-semibold"
            style={{ background: skin.theme.background }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{engineInfo[skin.engine_id as keyof typeof engineInfo]?.icon}</div>
              <div style={{ fontFamily: skin.theme.font_family }}>{skin.name}</div>
            </div>
          </div>
          
          {/* Información detallada */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Engine:</p>
              <p className="font-semibold">{engineInfo[skin.engine_id as keyof typeof engineInfo]?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Categoría:</p>
              <p className="font-semibold">{categoryInfo[skin.category as keyof typeof categoryInfo]?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Materia:</p>
              <p className="font-semibold">{skin.subject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Grados:</p>
              <p className="font-semibold">{skin.grades.join(', ')}</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{skin.description}</p>
          
          {/* Colores del tema */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Paleta de colores:</p>
            <div className="flex gap-2">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: skin.theme.primary_color }}
                title="Color primario"
              />
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: skin.theme.secondary_color }}
                title="Color secundario"
              />
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: skin.theme.accent_color }}
                title="Color de acento"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setPreviewSkin(null);
                setShowApplyModal({skin, show: true});
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Aplicar a Demo
            </button>
            <button 
              onClick={() => duplicateSkin(skin)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Duplicar Skin
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <SparklesIcon className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" />
            <p className="text-gray-600">Cargando sistema de skins...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-lg">
              <PaintBrushIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sistema de Skins</h1>
              <p className="text-gray-600">Personaliza la apariencia de tus juegos educativos</p>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Skins</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.total_skins}</p>
                  </div>
                  <SparklesIcon className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Engines</p>
                    <p className="text-2xl font-bold text-green-900">{stats.engines_covered.length}</p>
                  </div>
                  <CogIcon className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Categorías</p>
                    <p className="text-2xl font-bold text-purple-900">{Object.keys(stats.by_category).length}</p>
                  </div>
                  <AdjustmentsHorizontalIcon className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-600 text-sm font-medium">Materias</p>
                    <p className="text-2xl font-bold text-amber-900">{stats.subjects_covered.length}</p>
                  </div>
                  <FireIcon className="w-8 h-8 text-amber-500" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Engine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Engine</label>
              <select 
                value={selectedEngine} 
                onChange={(e) => setSelectedEngine(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los engines</option>
                {Object.entries(engineInfo).map(([id, info]) => (
                  <option key={id} value={id}>{info.icon} {info.name}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Materia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Materia</label>
              <select 
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las materias</option>
                <option value="MAT">📊 Matemática</option>
                <option value="LEN">📚 Lenguaje</option>
                <option value="CN">🧪 Ciencias Naturales</option>
              </select>
            </div>

            {/* Filtro por Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                {Object.entries(categoryInfo).map(([id, info]) => (
                  <option key={id} value={id}>{info.icon} {info.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Skins */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skins.map((skin) => (
            <div key={skin.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Header de la skin con tema */}
              <div 
                className="h-24 flex items-center justify-center text-white font-semibold"
                style={{ background: skin.theme.background }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{engineInfo[skin.engine_id as keyof typeof engineInfo]?.icon}</div>
                  <div style={{ fontFamily: skin.theme.font_family, fontSize: '0.9rem' }}>
                    {skin.name}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${engineInfo[skin.engine_id as keyof typeof engineInfo]?.color}`}>
                    {skin.engine_id}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${categoryInfo[skin.category as keyof typeof categoryInfo]?.color}`}>
                    {categoryInfo[skin.category as keyof typeof categoryInfo]?.name}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{skin.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{skin.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {skin.subject} • {skin.grades.join(', ')}
                  </div>
                  <button 
                    onClick={() => setPreviewSkin(skin)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                    title="Ver preview"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay skins */}
        {skins.length === 0 && (
          <div className="text-center py-12">
            <PaintBrushIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron skins</h3>
            <p className="text-gray-500">Intenta ajustar los filtros para ver más opciones</p>
          </div>
        )}

        {/* Modal de preview */}
        {previewSkin && <SkinPreview skin={previewSkin} />}
        {showApplyModal.show && showApplyModal.skin && <ApplyToDemo skin={showApplyModal.skin} />}
      </div>
    </DashboardLayout>
  );
};

export default SkinManagementPage; 