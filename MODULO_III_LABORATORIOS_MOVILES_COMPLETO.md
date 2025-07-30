# MÓDULO III - LABORATORIOS MÓVILES
## Material Concreto & ABP - Documentación Técnica Completa

### Versión 0.1 / Enero 2025

---

## 1. RESUMEN EJECUTIVO DEL MÓDULO

### 1.1 Propósito y Alcance MVP

**Objetivo pedagógico:** Orquestar el ciclo completo de uso de material manipulativo (piezas Montessori, mini-microscopios, bloques lógicos, etc.) alineado a OA MINEDUC y metodologías ABP.

**Resultado clave:** Evidencia trazable de que el laboratorio se utiliza, impacta en el progreso OA y sustenta decisiones de compra/fundraising.

**Scope MVP:** Lab Móvil Párvulo (PK–K2): catálogo, 40 actividades, registro de uso, dashboard de impacto.

### 1.2 KPIs de Éxito
- ✅ **≥ 70%** de actividades registradas al primer mes
- ✅ **≥ 1 evidencia** por actividad
- ✅ **Correlación positiva (ρ > 0,4)** entre uso y progreso OA en dashboards

---

## 2. ARQUITECTURA TÉCNICA

### 2.1 Stack Tecnológico

```
Frontend (React/Next.js) ← API REST → Backend (Express) ← Database (Supabase)
     ↓                                    ↓                      ↓
- Catálogo de actividades          - Gestión de materiales    - lab_material
- Dashboard de impacto             - Registro de uso          - lab_activity  
- Upload de evidencias             - Análisis de correlación  - lab_activity_log
- Admin de materiales              - Generación de reportes   - lab_evidence
```

### 2.2 Módulos del Sistema

```
📦 Módulo Laboratorios
├── 🏗️ Material Management
│   ├── lab_material (tabla materiales)
│   ├── lab_product (productos/kits)
│   └── AdminMaterialCRUD (solo superadmin)
├── 🎯 Activity Catalog  
│   ├── lab_activity (actividades por OA)
│   ├── FiltrableCardGrid (catálogo)
│   └── ActivityDetailView (guías)
├── 📊 Usage Tracking
│   ├── lab_activity_log (registro uso)
│   ├── lab_evidence (fotos/videos)
│   └── QuickRegisterModal (< 20s)
└── 📈 Impact Dashboard
    ├── UsageHeatMap (por curso)
    ├── OACorrelationChart (uso vs progreso)
    └── ExecutiveReport (PDF export)
```

---

## 3. MODELO DE DATOS

### 3.1 Esquema de Base de Datos

```sql
-- Productos/Kits de laboratorio
CREATE TABLE lab_product (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,                    -- "Lab Móvil Párvulo"
    code TEXT UNIQUE NOT NULL,             -- "lab_parvulo"
    description TEXT,
    target_cycles TEXT[],                  -- {"PK", "K1", "K2"}
    status lab_product_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Materiales individuales
CREATE TABLE lab_material (
    id SERIAL PRIMARY KEY,
    lab_product_id UUID REFERENCES lab_product(id),
    name TEXT NOT NULL,                    -- "Bloques lógicos Dienes"
    internal_code TEXT UNIQUE NOT NULL,    -- "BLD-001"
    specifications JSONB,                  -- {"pieces": 48, "material": "wood", "colors": ["red", "blue", "yellow"]}
    cover_image_url TEXT,
    quantity_per_kit INTEGER DEFAULT 1,
    status lab_material_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Actividades pedagógicas
CREATE TABLE lab_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_product_id UUID REFERENCES lab_product(id),
    title TEXT NOT NULL,                   -- "Clasificando formas y colores"
    slug TEXT UNIQUE NOT NULL,             -- "clasificando-formas-colores"
    oa_ids TEXT[],                         -- {"PK_MAT_OA1", "PK_MAT_OA3"}
    bloom_level bloom_level_enum,          -- 'comprender', 'aplicar', etc.
    target_cycle cycle_enum,               -- 'PK', 'K1', 'K2'
    duration_minutes INTEGER,              -- 35
    group_size INTEGER,                    -- 8
    cover_image_url TEXT,
    steps_markdown TEXT,                   -- Guía paso a paso
    video_url TEXT,
    resource_urls TEXT[],                  -- Links adicionales
    required_material_ids INTEGER[],       -- IDs de materiales necesarios
    assessment_markdown TEXT,              -- Guía de evaluación
    author TEXT,                           -- "María Paz Fuentes"
    status activity_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Registro de uso de actividades
CREATE TABLE lab_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES lab_activity(id),
    teacher_id UUID REFERENCES profiles(id),
    school_id UUID REFERENCES schools(id),
    course_id UUID REFERENCES courses(id),
    execution_date TIMESTAMP NOT NULL,
    student_count INTEGER,
    duration_actual_minutes INTEGER,
    notes TEXT,
    success_rating INTEGER CHECK (success_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Evidencias multimedia
CREATE TABLE lab_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_log_id UUID REFERENCES lab_activity_log(id),
    file_url TEXT NOT NULL,
    file_type evidence_type_enum,          -- 'photo', 'video', 'audio'
    file_size_bytes INTEGER,
    description TEXT,
    is_approved BOOLEAN DEFAULT NULL,      -- Para moderación
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tipos ENUM
CREATE TYPE lab_product_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE lab_material_status AS ENUM ('draft', 'active', 'out_of_stock', 'discontinued');
CREATE TYPE activity_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE cycle_enum AS ENUM ('PK', 'K1', 'K2', '1B', '2B');
CREATE TYPE evidence_type_enum AS ENUM ('photo', 'video', 'audio', 'document');
```

### 3.2 Políticas de Seguridad (RLS)

```sql
-- Solo superadmin puede gestionar materiales
CREATE POLICY p_crud_material_superadmin
ON lab_material
FOR ALL
USING (auth.jwt() ->> 'role' = 'superadmin')
WITH CHECK (auth.jwt() ->> 'role' = 'superadmin');

-- Lectura de actividades para todos los roles educativos
CREATE POLICY p_teacher_select_activities 
ON lab_activity
FOR SELECT
USING (
    status = 'active' AND 
    auth.jwt() ->> 'role' IN ('teacher', 'coordinator', 'admin_escolar')
);

-- Registro de logs: solo quien ejecuta puede insertar
CREATE POLICY p_insert_log_teacher 
ON lab_activity_log
FOR INSERT
WITH CHECK (
    auth.uid() = teacher_id AND
    auth.jwt() ->> 'role' IN ('teacher', 'coordinator')
);

-- Evidencias: solo el autor puede subir
CREATE POLICY p_insert_evidence
ON lab_evidence  
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM lab_activity_log 
        WHERE id = activity_log_id 
        AND teacher_id = auth.uid()
    )
);
```

---

## 4. ROLES DE USUARIO Y EXPERIENCIAS

### 4.1 Matriz de Permisos

| Rol | Ver Catálogo | Registrar Uso | Dashboard Curso | Dashboard Escuela | Admin Materiales |
|-----|-------------|---------------|-----------------|-------------------|------------------|
| **Docente** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Coordinador PIE** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Admin Escolar** | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Sostenedor** | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Superadmin EDU21** | ✅ | ✅ | ✅ | ✅ | ✅ |

### 4.2 User Stories Detalladas

#### **US-01: Docente busca actividad por OA**
```gherkin
GIVEN soy docente de Kinder 1
WHEN accedo al catálogo /lab/catalog  
AND filtro por "PK_MAT_OA1" y "30 minutos"
THEN veo las actividades relevantes en < 5 segundos
AND puedo abrir la guía paso a paso
```

#### **US-02: Docente registra ejecución rápida**
```gherkin
GIVEN terminé la actividad "Clasificando formas"
WHEN hago clic en "Registrar Ejecución"
AND completo: 18 estudiantes, "Excelente participación", subo 2 fotos
THEN el registro se guarda en < 20 segundos
AND recibo confirmación "✅ Registrado exitosamente"
```

#### **US-03: Coordinador detecta baja adopción**
```gherkin
GIVEN soy coordinador PIE
WHEN accedo al dashboard /lab/dashboard
THEN veo un mapa de calor por curso
AND identifico que "Kinder B" tiene 0% de actividades registradas
AND puedo contactar directamente a esa docente
```

#### **US-04: Sostenedor justifica inversión**
```gherkin
GIVEN soy sostenedor de la red
WHEN genero reporte trimestral
THEN obtengo PDF con:
- Correlación uso-material ↔ progreso OA (+23%)
- ROI estimado por escuela
- Recomendación de compra próximo kit
```

---

## 5. ARQUITECTURA DE INFORMACIÓN (UI/UX)

### 5.1 Catálogo de Actividades `/lab/catalog`

```tsx
// Filtros dinámicos en sidebar
interface CatalogFilters {
  oa_ids: string[]           // ["PK_MAT_OA1", "K1_LEN_OA5"]
  bloom_levels: string[]     // ["recordar", "comprender"]  
  target_cycles: string[]    // ["PK", "K1"]
  duration_range: [number, number]  // [15, 45] minutos
  group_size_max: number     // 12 estudiantes
  has_video: boolean
}

// Tarjeta de actividad
interface ActivityCard {
  cover_image: string
  title: string
  oa_tags: string[]          // Pills con colores por asignatura
  bloom_level: string        // Badge con ícono
  duration: number           // "⏱️ 35 min"
  group_size: number         // "👥 8 estudiantes"
  difficulty: 1|2|3|4|5     // Estrellas
  usage_count: number        // "✅ Usada 47 veces"
}
```

### 5.2 Vista de Actividad `/lab/activity/[slug]`

```tsx
// Layout principal
<ActivityDetailView>
  <Hero>
    <CoverImage />
    <Title />
    <OATags />
    <MetadataChips />          // Duración, grupo, Bloom
  </Hero>
  
  <TabsNavigation>
    <Tab id="guide">📋 Guía Paso a Paso</Tab>
    <Tab id="materials">🧰 Materiales</Tab>  
    <Tab id="video">🎥 Video</Tab>
    <Tab id="assessment">✅ Evaluación</Tab>
  </TabsNavigation>
  
  <TabContent>
    <GuideStepsMarkdown />     // Render de steps_markdown
    <MaterialsList />          // Join con lab_material
    <EmbeddedVideo />          // YouTube/Vimeo player
    <AssessmentChecklist />    // Parse de assessment_markdown
  </TabContent>
  
  <StickyActions>
    <Button variant="primary">📝 Registrar Ejecución</Button>
    <Button variant="outline">📄 Descargar PDF</Button>
    <Button variant="ghost">❤️ Favoritos</Button>
  </StickyActions>
</ActivityDetailView>
```

### 5.3 Modal de Registro Rápido

```tsx
// UX Express: < 20 segundos en móvil
<QuickRegisterModal activity={activity}>
  <AutoFields>
    <DateTimeField value={new Date()} disabled />  // Auto
    <TeacherField value={currentUser.name} disabled />
    <CourseSelect options={myCourses} required />
  </AutoFields>
  
  <ManualFields>
    <NumberInput 
      label="Estudiantes participantes" 
      placeholder="18" 
      min={1} max={45} 
    />
    <SpeechToTextArea 
      label="Notas rápidas" 
      placeholder="Toca el micrófono y describe cómo fue..."
    />
    <RatingStars 
      label="¿Cómo resultó?" 
      scale={1-5}
    />
  </ManualFields>
  
  <EvidenceUpload>
    <DragDropZone 
      accept="image/*,video/*"
      maxFiles={5}
      maxSize="10MB"
    />
    <CameraCapture />          // Para móvil
  </EvidenceUpload>
  
  <Actions>
    <Button variant="primary" loadingText="Guardando...">
      ✅ Registrar
    </Button>
  </Actions>
</QuickRegisterModal>
```

---

## 6. DASHBOARD DE IMPACTO

### 6.1 Widgets de Métricas

```tsx
// Mapa de calor de uso por curso
<UsageHeatMap>
  {courses.map(course => (
    <HeatCell 
      key={course.id}
      usage={getUsagePercentage(course)}
      color={getHeatColor(usage)}
      onClick={() => drillDown(course)}
    >
      {course.name}
      <span>{usage}%</span>
    </HeatCell>
  ))}
</UsageHeatMap>

// Correlación uso ↔ progreso OA
<CorrelationScatterPlot>
  <XAxis label="% Actividades ejecutadas" />
  <YAxis label="% Dominio promedio OA" />
  <DataPoints>
    {courses.map(course => (
      <Point 
        x={course.lab_usage_pct}
        y={course.oa_mastery_pct}
        color={course.correlation > 0.4 ? 'green' : 'amber'}
        tooltip={`${course.name}: r=${course.correlation}`}
      />
    ))}
  </DataPoints>
  <TrendLine equation={linearRegression(data)} />
</CorrelationScatterPlot>

// Top 5 actividades más usadas
<TopActivitiesWidget>
  {topActivities.map((activity, index) => (
    <ActivityRankItem key={activity.id}>
      <Rank>#{index + 1}</Rank>
      <Thumbnail src={activity.cover_image} />
      <Info>
        <Title>{activity.title}</Title>
        <Stats>
          ✅ {activity.usage_count} ejecuciones
          ⭐ {activity.avg_rating}/5
          ⏱️ {activity.avg_duration}min promedio
        </Stats>
      </Info>
      <TrendChart data={activity.weekly_usage} />
    </ActivityRankItem>
  ))}
</TopActivitiesWidget>
```

### 6.2 Generación de Reportes

```typescript
// API para generar reporte ejecutivo
export async function generateExecutiveReport(schoolId: string, period: string) {
  const data = await Promise.all([
    getLabUsageStats(schoolId, period),
    getOACorrelationData(schoolId, period),
    getTeacherAdoptionMetrics(schoolId, period),
    getMaterialUtilizationRates(schoolId, period)
  ]);
  
  const pdfBuffer = await generatePDF({
    template: 'executive-lab-report',
    data: {
      school: await getSchoolInfo(schoolId),
      period,
      metrics: {
        totalActivities: data[0].total_executions,
        uniqueTeachers: data[2].active_teachers,
        avgCorrelation: data[1].correlation_coefficient,
        roiEstimate: calculateROI(data[3])
      },
      charts: {
        usageHeatMap: await generateChartImage(data[0]),
        correlationScatter: await generateChartImage(data[1]),
        trendLines: await generateChartImage(data[0])
      },
      recommendations: generateRecommendations(data)
    }
  });
  
  return pdfBuffer;
}
```

---

## 7. GESTIÓN DE MATERIALES (SUPERADMIN)

### 7.1 Interfaz de Administración

```tsx
// Panel de administración de materiales
<AdminMaterialPanel>
  <Header>
    <Title>Gestión de Materiales</Title>
    <Actions>
      <Button variant="primary" onClick={() => setCreating(true)}>
        ➕ Nuevo Material
      </Button>
      <ImportButton accept=".csv" />
      <ExportButton format="xlsx" />
    </Actions>
  </Header>
  
  <FilterBar>
    <SearchInput placeholder="Buscar por nombre o código..." />
    <Select label="Laboratorio" options={labProducts} />
    <Select label="Estado" options={materialStatuses} />
  </FilterBar>
  
  <DataTable
    data={materials}
    columns={[
      { key: 'cover_image', render: ImageThumbnail },
      { key: 'name', sortable: true },
      { key: 'internal_code', sortable: true },
      { key: 'lab_product.name', label: 'Laboratorio' },
      { key: 'quantity_per_kit', label: 'Cant/Kit' },
      { key: 'status', render: StatusBadge },
      { key: 'actions', render: ActionsDropdown }
    ]}
    onRowClick={handleEditMaterial}
  />
</AdminMaterialPanel>
```

### 7.2 Formulario de Material (Wizard)

```tsx
// Wizard de 2 pasos para crear/editar material
<MaterialWizard>
  <Step1 title="Información Básica">
    <TextInput 
      label="Nombre del material"
      placeholder="Bloques lógicos Dienes"
      required
    />
    <TextInput 
      label="Código interno"
      placeholder="BLD-001"
      pattern="[A-Z]{3}-[0-9]{3}"
      required
    />
    <Select 
      label="Laboratorio destino"
      options={labProducts}
      required
    />
    <NumberInput 
      label="Cantidad por kit"
      min={1} max={100}
      defaultValue={1}
    />
    <Select 
      label="Estado"
      options={[
        { value: 'draft', label: '📝 Borrador' },
        { value: 'active', label: '✅ Activo' },
        { value: 'out_of_stock', label: '❌ Sin stock' }
      ]}
    />
  </Step1>
  
  <Step2 title="Multimedia y Especificaciones">
    <ImageUpload 
      label="Foto del material"
      aspect={4/3}
      maxSize="1MB"
      required
    />
    <SpecificationBuilder 
      label="Especificaciones técnicas"
      schema={materialSpecSchema}
      defaultValue={{}}
    />
    <TextArea 
      label="Descripción adicional"
      placeholder="Detalles de uso, cuidados especiales..."
    />
  </Step2>
</MaterialWizard>
```

### 7.3 Builder de Especificaciones

```tsx
// Builder visual para especificaciones JSON
<SpecificationBuilder value={specs} onChange={setSpecs}>
  <FieldGroup label="Dimensiones">
    <NumberInput name="length_cm" label="Largo (cm)" />
    <NumberInput name="width_cm" label="Ancho (cm)" />
    <NumberInput name="height_cm" label="Alto (cm)" />
  </FieldGroup>
  
  <FieldGroup label="Composición">
    <NumberInput name="pieces" label="Número de piezas" />
    <Select name="material" options={['wood', 'plastic', 'metal', 'fabric']} />
    <TagInput name="colors" label="Colores disponibles" />
  </FieldGroup>
  
  <FieldGroup label="Seguridad">
    <Checkbox name="non_toxic" label="No tóxico" />
    <Select name="age_recommendation" options={['3+', '4+', '5+', '6+']} />
    <TagInput name="certifications" label="Certificaciones" />
  </FieldGroup>
  
  <CustomFields>
    <Button 
      variant="outline" 
      onClick={() => addCustomField()}
    >
      ➕ Campo personalizado
    </Button>
  </CustomFields>
</SpecificationBuilder>
```

---

## 8. API REST

### 8.1 Endpoints de Actividades

```typescript
// GET /api/lab/activities - Listar actividades con filtros
interface ActivityListQuery {
  oa_ids?: string[]
  bloom_levels?: string[]
  target_cycles?: string[]
  duration_min?: number
  duration_max?: number
  group_size_max?: number
  has_video?: boolean
  page?: number
  limit?: number
}

// GET /api/lab/activities/:id - Detalle de actividad
interface ActivityDetailResponse {
  id: string
  title: string
  slug: string
  oa_ids: string[]
  bloom_level: string
  cover_image_url: string
  steps_markdown: string
  video_url?: string
  resource_urls: string[]
  required_materials: Material[]
  assessment_markdown: string
  usage_stats: {
    total_executions: number
    avg_rating: number
    avg_duration: number
  }
}

// POST /api/lab/activity-logs - Registrar ejecución
interface CreateActivityLogRequest {
  activity_id: string
  course_id: string
  execution_date: string
  student_count: number
  duration_actual_minutes?: number
  notes?: string
  success_rating: 1|2|3|4|5
  evidence_files?: File[]
}
```

### 8.2 Endpoints de Dashboard

```typescript
// GET /api/lab/dashboard/usage-heatmap
interface UsageHeatMapResponse {
  courses: Array<{
    id: string
    name: string
    usage_percentage: number
    total_activities: number
    executed_activities: number
    last_execution: string
  }>
}

// GET /api/lab/dashboard/oa-correlation
interface OACorrelationResponse {
  correlation_coefficient: number
  p_value: number
  data_points: Array<{
    course_id: string
    course_name: string
    lab_usage_pct: number
    oa_mastery_pct: number
  }>
  trend_line: {
    slope: number
    intercept: number
    r_squared: number
  }
}

// GET /api/lab/dashboard/executive-report
interface ExecutiveReportQuery {
  school_id: string
  period: 'month' | 'quarter' | 'semester' | 'year'
  format: 'json' | 'pdf'
}
```

### 8.3 Endpoints de Administración

```typescript
// POST /api/lab/materials (Solo superadmin)
interface CreateMaterialRequest {
  name: string
  internal_code: string
  lab_product_id: string
  specifications: Record<string, any>
  cover_image: File
  quantity_per_kit: number
  status: 'draft' | 'active' | 'out_of_stock'
}

// PUT /api/lab/materials/:id (Solo superadmin)
interface UpdateMaterialRequest extends Partial<CreateMaterialRequest> {}

// DELETE /api/lab/materials/:id (Solo superadmin)
// Soft delete → actualiza status a 'discontinued'
```

---

## 9. IMPLEMENTACIÓN DEL FRONTEND

### 9.1 Estructura de Directorios

```
client/src/
├── app/lab/                   # Rutas del módulo lab
│   ├── catalog/
│   │   └── page.tsx          # Catálogo de actividades
│   ├── activity/[slug]/
│   │   └── page.tsx          # Detalle de actividad
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard de impacto
│   └── admin/
│       └── materials/
│           ├── page.tsx      # Lista de materiales
│           ├── new/
│           │   └── page.tsx  # Crear material
│           └── [id]/edit/
│               └── page.tsx  # Editar material
├── components/lab/            # Componentes específicos del lab
│   ├── ActivityCard.tsx
│   ├── ActivityDetailView.tsx
│   ├── QuickRegisterModal.tsx
│   ├── UsageHeatMap.tsx
│   ├── CorrelationChart.tsx
│   └── admin/
│       ├── MaterialTable.tsx
│       ├── MaterialWizard.tsx
│       └── SpecificationBuilder.tsx
├── hooks/lab/                 # Hooks personalizados
│   ├── useLabActivities.ts
│   ├── useActivityLogs.ts
│   ├── useUsageMetrics.ts
│   └── useMaterialCRUD.ts
└── types/lab.ts              # Tipos TypeScript
```

### 9.2 Componente Principal del Catálogo

```tsx
// app/lab/catalog/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { useLabActivities } from '@/hooks/lab/useLabActivities'
import { ActivityCard } from '@/components/lab/ActivityCard'
import { FilterSidebar } from '@/components/lab/FilterSidebar'
import { LoadingGrid } from '@/components/ui/LoadingGrid'

interface CatalogFilters {
  oa_ids: string[]
  bloom_levels: string[]
  target_cycles: string[]
  duration_range: [number, number]
  group_size_max: number
  has_video: boolean
  search: string
}

export default function LabCatalogPage() {
  const [filters, setFilters] = useState<CatalogFilters>({
    oa_ids: [],
    bloom_levels: [],
    target_cycles: [],
    duration_range: [5, 120],
    group_size_max: 30,
    has_video: false,
    search: ''
  })

  const { data: activities, isLoading, error } = useLabActivities(filters)

  const filteredActivities = useMemo(() => {
    if (!activities) return []
    
    return activities.filter(activity => {
      // Filtro de búsqueda por texto
      if (filters.search && !activity.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      
      // Otros filtros se aplican en el backend via query params
      return true
    })
  }, [activities, filters.search])

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🧪 Catálogo de Laboratorio
          </h1>
          <p className="mt-2 text-gray-600">
            Encuentra actividades con material concreto alineadas a tus OA
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar de filtros */}
          <aside className="w-80 flex-shrink-0">
            <FilterSidebar 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </aside>

          {/* Grid de actividades */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">
                {filteredActivities.length} actividades encontradas
              </p>
              <SortDropdown />
            </div>

            {isLoading ? (
              <LoadingGrid cols={3} rows={4} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map(activity => (
                  <ActivityCard 
                    key={activity.id}
                    activity={activity}
                  />
                ))}
              </div>
            )}

            {filteredActivities.length === 0 && !isLoading && (
              <EmptyState 
                title="No se encontraron actividades"
                description="Intenta ajustar los filtros o contacta al administrador"
                action={<Button onClick={() => setFilters({})}>Limpiar filtros</Button>}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
```

### 9.3 Hook para Gestión de Actividades

```tsx
// hooks/lab/useLabActivities.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface ActivityFilters {
  oa_ids?: string[]
  bloom_levels?: string[]
  target_cycles?: string[]
  duration_range?: [number, number]
  group_size_max?: number
  has_video?: boolean
}

export function useLabActivities(filters: ActivityFilters = {}) {
  return useQuery({
    queryKey: ['lab-activities', filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      
      if (filters.oa_ids?.length) {
        searchParams.set('oa_ids', filters.oa_ids.join(','))
      }
      if (filters.bloom_levels?.length) {
        searchParams.set('bloom_levels', filters.bloom_levels.join(','))
      }
      if (filters.target_cycles?.length) {
        searchParams.set('target_cycles', filters.target_cycles.join(','))
      }
      if (filters.duration_range) {
        searchParams.set('duration_min', filters.duration_range[0].toString())
        searchParams.set('duration_max', filters.duration_range[1].toString())
      }
      if (filters.group_size_max) {
        searchParams.set('group_size_max', filters.group_size_max.toString())
      }
      if (filters.has_video) {
        searchParams.set('has_video', 'true')
      }

      const response = await fetch(`/api/lab/activities?${searchParams}`)
      if (!response.ok) {
        throw new Error('Error al cargar actividades')
      }
      
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export function useActivityDetail(slug: string) {
  return useQuery({
    queryKey: ['lab-activity', slug],
    queryFn: async () => {
      const response = await fetch(`/api/lab/activities/${slug}`)
      if (!response.ok) {
        throw new Error('Actividad no encontrada')
      }
      return response.json()
    },
    enabled: !!slug,
  })
}

export function useRegisterActivityExecution() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: {
      activity_id: string
      course_id: string
      student_count: number
      notes?: string
      success_rating: number
      evidence_files?: File[]
    }) => {
      const formData = new FormData()
      
      // Campos básicos
      formData.append('activity_id', data.activity_id)
      formData.append('course_id', data.course_id)
      formData.append('execution_date', new Date().toISOString())
      formData.append('student_count', data.student_count.toString())
      formData.append('success_rating', data.success_rating.toString())
      
      if (data.notes) {
        formData.append('notes', data.notes)
      }
      
      // Archivos de evidencia
      if (data.evidence_files?.length) {
        data.evidence_files.forEach((file, index) => {
          formData.append(`evidence_${index}`, file)
        })
      }
      
      const response = await fetch('/api/lab/activity-logs', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Error al registrar ejecución')
      }
      
      return response.json()
    },
    onSuccess: () => {
      toast.success('✅ Ejecución registrada exitosamente')
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['lab-dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] })
    },
    onError: (error) => {
      toast.error('❌ Error al registrar: ' + error.message)
    }
  })
}
```

---

## 10. TESTING E IMPLEMENTACIÓN

### 10.1 Suite de Testing

```typescript
// tests/lab/catalog.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import LabCatalogPage from '@/app/lab/catalog/page'

// Mock del hook
vi.mock('@/hooks/lab/useLabActivities', () => ({
  useLabActivities: vi.fn(() => ({
    data: mockActivities,
    isLoading: false,
    error: null
  }))
}))

describe('Lab Catalog Page', () => {
  test('renders activity cards correctly', async () => {
    render(<LabCatalogPage />)
    
    expect(screen.getByText('🧪 Catálogo de Laboratorio')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Clasificando formas y colores')).toBeInTheDocument()
    })
  })

  test('filters activities by OA', async () => {
    render(<LabCatalogPage />)
    
    const oaFilter = screen.getByLabelText('Filtrar por OA')
    fireEvent.click(oaFilter)
    fireEvent.click(screen.getByText('PK_MAT_OA1'))
    
    await waitFor(() => {
      expect(useLabActivities).toHaveBeenCalledWith(
        expect.objectContaining({
          oa_ids: ['PK_MAT_OA1']
        })
      )
    })
  })

  test('opens quick register modal', async () => {
    render(<LabCatalogPage />)
    
    const registerButton = screen.getByText('📝 Registrar Ejecución')
    fireEvent.click(registerButton)
    
    await waitFor(() => {
      expect(screen.getByText('Registrar ejecución de actividad')).toBeInTheDocument()
    })
  })
})
```

### 10.2 Testing E2E con Playwright

```typescript
// tests/e2e/lab-workflow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Lab Module Complete Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid=email]', 'teacher@test.com')
    await page.fill('[data-testid=password]', 'password')
    await page.click('[data-testid=login-button]')
  })

  test('teacher can find and execute activity', async ({ page }) => {
    // Navegar al catálogo
    await page.goto('/lab/catalog')
    await expect(page.getByText('🧪 Catálogo de Laboratorio')).toBeVisible()

    // Filtrar actividades
    await page.click('[data-testid=filter-oa]')
    await page.click('[data-testid=oa-PK_MAT_OA1]')
    
    // Verificar que aparecen actividades filtradas
    await expect(page.locator('[data-testid=activity-card]')).toBeVisible()

    // Abrir detalle de actividad
    await page.click('[data-testid=activity-card]').first()
    await expect(page.getByText('📋 Guía Paso a Paso')).toBeVisible()

    // Registrar ejecución
    await page.click('[data-testid=register-execution]')
    
    // Llenar formulario modal
    await page.fill('[data-testid=student-count]', '18')
    await page.fill('[data-testid=notes]', 'Excelente participación de los niños')
    await page.click('[data-testid=rating-5]')
    
    // Subir evidencia (imagen)
    await page.setInputFiles('[data-testid=evidence-upload]', './tests/fixtures/test-image.jpg')
    
    // Confirmar registro
    await page.click('[data-testid=confirm-register]')
    
    // Verificar éxito
    await expect(page.getByText('✅ Ejecución registrada exitosamente')).toBeVisible()
    
    // Verificar que se redirecciona o actualiza
    await expect(page.url()).toContain('/lab/catalog')
  })

  test('coordinator can view usage dashboard', async ({ page }) => {
    // Login como coordinador
    await page.goto('/lab/dashboard')
    
    // Verificar widgets del dashboard
    await expect(page.getByText('Mapa de uso por curso')).toBeVisible()
    await expect(page.getByText('Correlación uso ↔ progreso OA')).toBeVisible()
    await expect(page.getByText('Top 5 actividades')).toBeVisible()
    
    // Verificar que aparecen datos
    await expect(page.locator('[data-testid=usage-heatmap]')).toBeVisible()
    await expect(page.locator('[data-testid=correlation-chart]')).toBeVisible()
    
    // Exportar reporte
    await page.click('[data-testid=export-report]')
    await expect(page.getByText('Generando reporte...')).toBeVisible()
    
    // Verificar descarga (mock en test)
    await expect(page.getByText('✅ Reporte generado')).toBeVisible()
  })

  test('performance: register execution under 25 seconds', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/lab/catalog')
    await page.click('[data-testid=activity-card]').first()
    await page.click('[data-testid=register-execution]')
    
    await page.fill('[data-testid=student-count]', '20')
    await page.click('[data-testid=rating-4]')
    await page.click('[data-testid=confirm-register]')
    
    await expect(page.getByText('✅ Ejecución registrada exitosamente')).toBeVisible()
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    expect(duration).toBeLessThan(25000) // < 25 segundos
  })
})
```

---

## 11. DEPLOYMENT Y DEVOPS

### 11.1 Pipeline CI/CD

```yaml
# .github/workflows/lab-module.yml
name: Lab Module CI/CD

on:
  push:
    paths:
      - 'client/src/app/lab/**'
      - 'client/src/components/lab/**'
      - 'server/routes/lab/**'
      - 'server/database/lab-*.sql'
  pull_request:
    paths:
      - 'client/src/app/lab/**'
      - 'client/src/components/lab/**'
      - 'server/routes/lab/**'

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: edu21_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Setup test database
        run: |
          psql -h localhost -U postgres -d edu21_test -f server/database/init.sql
          psql -h localhost -U postgres -d edu21_test -f server/database/lab-schema.sql
        env:
          PGPASSWORD: postgres
      
      - name: Run unit tests
        run: pnpm test:lab --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/edu21_test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lab/lcov.info
      
      - name: Build application
        run: pnpm build
      
      - name: Run E2E tests
        run: pnpm test:e2e:lab
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/edu21_test

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel Preview
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://${{ steps.deploy.outputs.preview-url }}/lab/catalog
            https://${{ steps.deploy.outputs.preview-url }}/lab/dashboard
          uploadArtifacts: true

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel Production
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: Run Supabase migrations
        run: |
          npx supabase db push --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      
      - name: Create Sentry release
        uses: getsentry/action-release@v1
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: edu21
          SENTRY_PROJECT: lab-module
        with:
          environment: production
          version: ${{ github.sha }}
```

### 11.2 Monitoreo y Observabilidad

```typescript
// lib/lab/monitoring.ts
import * as Sentry from '@sentry/nextjs'

// Métricas específicas del módulo lab
export const labMetrics = {
  // Tiempo de carga del catálogo
  trackCatalogLoadTime: (duration: number, filterCount: number) => {
    Sentry.addBreadcrumb({
      category: 'lab.performance',
      message: `Catalog loaded in ${duration}ms with ${filterCount} filters`,
      level: 'info',
      data: { duration, filterCount }
    })
    
    if (duration > 3000) {
      Sentry.captureMessage('Slow catalog load', 'warning')
    }
  },

  // Registro de ejecución exitoso
  trackActivityExecution: (activityId: string, duration: number, evidenceCount: number) => {
    Sentry.addBreadcrumb({
      category: 'lab.usage',
      message: `Activity ${activityId} executed`,
      level: 'info',
      data: { activityId, duration, evidenceCount }
    })
  },

  // Error en upload de evidencia
  trackEvidenceUploadError: (error: Error, fileSize: number, fileType: string) => {
    Sentry.captureException(error, {
      tags: {
        module: 'lab',
        action: 'evidence_upload'
      },
      extra: {
        fileSize,
        fileType
      }
    })
  },

  // Dashboard render performance
  trackDashboardRender: (widgetCount: number, dataPoints: number, renderTime: number) => {
    Sentry.addBreadcrumb({
      category: 'lab.dashboard',
      message: `Dashboard rendered with ${widgetCount} widgets`,
      level: 'info',
      data: { widgetCount, dataPoints, renderTime }
    })
  }
}

// Health checks específicos
export async function labHealthCheck() {
  const checks = {
    database: false,
    storage: false,
    api: false
  }

  try {
    // Verificar conexión a base de datos
    const dbResponse = await fetch('/api/lab/health/database')
    checks.database = dbResponse.ok

    // Verificar storage de evidencias
    const storageResponse = await fetch('/api/lab/health/storage')
    checks.storage = storageResponse.ok

    // Verificar APIs críticas
    const apiResponse = await fetch('/api/lab/activities?limit=1')
    checks.api = apiResponse.ok

  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'lab', check: 'health' }
    })
  }

  return checks
}
```

---

## 12. MÉTRICAS Y KPIs

### 12.1 Dashboard de Métricas Internas

```typescript
// Dashboard interno para monitorear salud del módulo
interface LabHealthMetrics {
  // Adopción
  activeDailyTeachers: number
  materialActiveRatio: number        // actividades usadas ÷ catálogo total
  avgRegistrationLag: number         // tiempo promedio entre ejecución y registro
  
  // Calidad
  evidenceIntegrityScore: number     // evidencias válidas ÷ total subidas
  avgExecutionRating: number         // rating promedio de las actividades
  correlationStrength: number       // correlación uso-progreso OA
  
  // Performance
  catalogLoadTime: number            // P95 tiempo de carga catálogo
  registrationSuccessRate: number   // registros exitosos ÷ intentos
  crashFreeRate: number             // sesiones sin errores
  
  // Engagement
  activitiesPerTeacher: number       // promedio actividades/mes por docente
  evidencePerActivity: number        // fotos+videos promedio por ejecución
  returnUsageRate: number            // docentes que usan >1 vez
}

export async function getLabHealthMetrics(schoolId?: string): Promise<LabHealthMetrics> {
  const [adoption, quality, performance, engagement] = await Promise.all([
    getAdoptionMetrics(schoolId),
    getQualityMetrics(schoolId),
    getPerformanceMetrics(schoolId),
    getEngagementMetrics(schoolId)
  ])

  return {
    activeDailyTeachers: adoption.daily_teachers,
    materialActiveRatio: adoption.material_ratio,
    avgRegistrationLag: adoption.avg_lag_minutes,
    
    evidenceIntegrityScore: quality.evidence_score,
    avgExecutionRating: quality.avg_rating,
    correlationStrength: quality.correlation,
    
    catalogLoadTime: performance.p95_load_time,
    registrationSuccessRate: performance.success_rate,
    crashFreeRate: performance.crash_free_rate,
    
    activitiesPerTeacher: engagement.activities_per_teacher,
    evidencePerActivity: engagement.evidence_per_activity,
    returnUsageRate: engagement.return_rate
  }
}
```

### 12.2 Alertas Automáticas

```typescript
// Sistema de alertas para métricas críticas
interface LabAlert {
  metric: string
  threshold: number
  current: number
  severity: 'warning' | 'critical'
  action: string
}

export async function checkLabAlerts(): Promise<LabAlert[]> {
  const metrics = await getLabHealthMetrics()
  const alerts: LabAlert[] = []

  // Baja adopción
  if (metrics.materialActiveRatio < 0.4) {
    alerts.push({
      metric: 'Material Active Ratio',
      threshold: 0.4,
      current: metrics.materialActiveRatio,
      severity: 'warning',
      action: 'Revisar comunicación y capacitación docente'
    })
  }

  // Correlación muy baja
  if (metrics.correlationStrength < 0.2) {
    alerts.push({
      metric: 'OA Correlation',
      threshold: 0.2,
      current: metrics.correlationStrength,
      severity: 'critical',
      action: 'Revisar calidad de actividades y alineación OA'
    })
  }

  // Performance degradada
  if (metrics.catalogLoadTime > 5000) {
    alerts.push({
      metric: 'Catalog Load Time',
      threshold: 5000,
      current: metrics.catalogLoadTime,
      severity: 'warning',
      action: 'Optimizar queries y caching'
    })
  }

  // Evidencias de baja calidad
  if (metrics.evidenceIntegrityScore < 0.8) {
    alerts.push({
      metric: 'Evidence Integrity',
      threshold: 0.8,
      current: metrics.evidenceIntegrityScore,
      severity: 'warning',
      action: 'Mejorar UX de upload y validaciones'
    })
  }

  return alerts
}

// Envío automático de alertas
export async function sendLabAlerts() {
  const alerts = await checkLabAlerts()
  
  if (alerts.length > 0) {
    await Promise.all([
      // Slack
      sendSlackNotification('#lab-alerts', {
        text: `🚨 ${alerts.length} alertas del módulo Lab`,
        attachments: alerts.map(alert => ({
          color: alert.severity === 'critical' ? 'danger' : 'warning',
          title: alert.metric,
          text: `${alert.current} (umbral: ${alert.threshold})`,
          footer: alert.action
        }))
      }),
      
      // Email a stakeholders
      sendEmailAlert('lab-stakeholders@edu21.cl', {
        subject: `Alertas del Módulo Lab - ${new Date().toLocaleDateString()}`,
        html: generateAlertEmailHTML(alerts)
      }),
      
      // Sentry
      alerts.filter(a => a.severity === 'critical').forEach(alert => {
        Sentry.captureMessage(`Critical lab metric: ${alert.metric}`, 'error', {
          tags: { module: 'lab', metric: alert.metric },
          extra: alert
        })
      })
    ])
  }
}
```

---

## 13. ROADMAP DE DESARROLLO

### 13.1 Fase 1: MVP (2-3 meses)
**Objetivo:** Funcionalidad básica operativa en escuelas piloto

**Entregables:**
- ✅ Base de datos y API REST completa
- ✅ Catálogo de actividades con filtros
- ✅ Registro rápido de ejecuciones  
- ✅ Dashboard básico de uso
- ✅ Admin de materiales (superadmin)
- ✅ 40 actividades párvulo curadas
- ✅ Testing suite completo
- ✅ Deploy en producción

**Criterios de éxito:**
- 3 escuelas piloto activas
- ≥70% actividades registradas mes 1
- NPS ≥40 con docentes
- Tiempo registro <25 segundos

### 13.2 Fase 2: Lab Ciencias (4-6 meses)
**Objetivo:** Expansión a materiales STEM con sensores

**Entregables:**
- 🔬 Integración sensores LEGO SPIKE/WeDo
- 📊 Registro automático de datos experimentales
- 🧪 Kit "Lab Ciencias Básica" (1°-4° básico)
- 📈 Análisis de datos científicos en dashboard
- 🎯 50 actividades STEM curadas

**Tecnologías nuevas:**
- WebBluetooth API para sensores
- Chart.js para visualización de datos
- Algoritmos de análisis estadístico básico

### 13.3 Fase 3: Modo Estudiante (7-9 meses)
**Objetivo:** Autonomía estudiantil y gamificación

**Entregables:**
- 📱 PWA optimizada para tablets
- 🔍 Sistema QR en cajas de materiales
- 🎮 Gamificación "búsqueda del tesoro"
- 👥 Trabajo colaborativo entre estudiantes
- 🏆 Sistema de logros y badges

**UX Research:**
- Testing con niños 4-8 años
- Accesibilidad motriz fina
- Feedback visual inmediato

### 13.4 Fase 4: IA Recomendaciones (10-12 meses)
**Objetivo:** Personalización inteligente

**Entregables:**
- 🤖 Motor ML para sugerencias personalizadas
- 📊 Análisis de gaps de aprendizaje
- 🎯 Recomendaciones por estilo docente
- 📈 Predicción de éxito de actividades
- 🔄 Optimización automática de secuencias

**ML Pipeline:**
- Collaborative filtering (docentes similares)
- Content-based filtering (por OA y Bloom)
- A/B testing de recomendaciones

### 13.5 Fase 5: Offline Sync (12+ meses)
**Objetivo:** Funcionalidad en zonas rurales

**Entregables:**
- 💾 Base de datos local (PouchDB)
- 🔄 Sincronización bidireccional
- 📱 App móvil nativa opcional
- 🌐 Modo completamente offline
- 📡 Sync inteligente por ancho de banda

---

## 14. CONCLUSIONES

### 14.1 Impacto Esperado

**Pedagógico:**
- Integración fluida material concreto ↔ evaluaciones digitales
- Evidencia objetiva del valor del material manipulativo
- Mejora en correlación uso-material vs progreso OA (+40% esperado)

**Operacional:**
- Reducción 60% tiempo planificación docente
- Aumento 80% en registro de actividades
- Justificación data-driven para inversiones

**Estratégico:**
- Diferenciación competitiva en mercado educativo
- Base para módulos STEM avanzados
- Modelo de monetización adicional (kits + software)

### 14.2 Riesgos y Mitigaciones

**Alto Riesgo:**
- Resistencia docente a registro digital
  - *Mitigación: UX ultra-simple + incentivos gamificados*

**Medio Riesgo:**
- Calidad variable de evidencias subidas
  - *Mitigación: Validación automática + feedback inmediato*

**Bajo Riesgo:**
- Performance con muchas imágenes
  - *Mitigación: CDN + compresión automática + lazy loading*

### 14.3 Métricas de Éxito Global

| Métrica | Baseline | Meta 3 meses | Meta 6 meses | Meta 12 meses |
|---------|----------|--------------|--------------|---------------|
| Escuelas activas | 0 | 3 | 15 | 50 |
| Actividades ejecutadas/mes | 0 | 120 | 800 | 3000 |
| Correlación uso-OA | N/A | 0.4 | 0.5 | 0.6 |
| NPS docentes | N/A | 40 | 60 | 70 |
| Tiempo registro promedio | N/A | <25s | <20s | <15s |

**Este módulo representa la evolución natural de EDU21 hacia un ecosistema educativo integral que combina lo mejor del mundo digital y físico para maximizar el aprendizaje.** 