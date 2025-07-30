'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition, Disclosure } from '@headlessui/react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/store/auth'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  PlayIcon,
  TrophyIcon,
  ChartBarIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  EyeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PhoneIcon,
  IdentificationIcon,
  DocumentChartBarIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  PresentationChartBarIcon,
  UserCircleIcon,
  BanknotesIcon,
  StarIcon,
  DocumentCheckIcon,
  CalculatorIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  UserIcon,
  PaintBrushIcon,
  BeakerIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import NotificationBell from '@/components/ui/NotificationBell'

interface NavigationItem {
  name: string
  href?: string
  icon: any
  children?: NavigationItem[]
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const getNavigationItems = (): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Perfil', href: '/profile', icon: UserCircleIcon },
    ]

    if (!user?.role) return baseItems

    switch (user.role) {
      case 'TEACHER':
        return [
          { name: 'Dashboard', href: '/teacher/dashboard', icon: HomeIcon },
          {
            name: 'Módulo Laboratorios',
            icon: BeakerIcon,
            children: [
              { name: 'Catálogo de Actividades', href: '/teacher/labs/activities', icon: BookOpenIcon },
              // Puedes agregar aquí otras rutas funcionales del laboratorio si las necesitas
            ]
          },
          {
            name: 'Evaluación',
            icon: DocumentTextIcon,
            children: [
              { name: 'Evaluación Gamificada', href: '/teacher/oa1-games', icon: TrophyIcon },
            ]
          },
          {
            name: 'Reportes',
            icon: ChartBarIcon,
            children: [
              { name: 'Análisis y Métricas', href: '/teacher/reports', icon: DocumentChartBarIcon },
            ]
          },
          // Eliminado: { name: 'Configuración', href: '/teacher/settings', icon: CogIcon },
          // Eliminado: { name: 'Ayuda', href: '/help', icon: QuestionMarkCircleIcon },
        ];
      case 'STUDENT':
        return [
          { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
          {
            name: 'Mi Aprendizaje',
            icon: BookOpenIcon,
            children: [
              { name: 'Mis Clases', href: '/student/classes', icon: BookOpenIcon },
              { name: 'Materiales de Estudio', href: '/student/materials', icon: FolderIcon },
              { name: 'Mi Calendario', href: '/student/calendar', icon: CalendarIcon },
            ]
          },
          {
            name: 'Actividades',
            icon: PlayIcon,
            children: [
              { name: 'Tareas Pendientes', href: '/student/assignments', icon: DocumentTextIcon },
              { name: 'Juegos Educativos', href: '/student/games', icon: PlayIcon },
            ]
          },
          {
            name: 'Mi Progreso',
            icon: ChartBarIcon,
            children: [
              { name: 'Calificaciones', href: '/student/grades', icon: TrophyIcon },
              { name: 'Logros y Medallas', href: '/student/achievements', icon: StarIcon },
              { name: 'Análisis de Progreso', href: '/student/progress', icon: ChartBarIcon },
              { name: 'Mi Asistencia', href: '/student/attendance', icon: ClipboardDocumentCheckIcon },
            ]
          },
          {
            name: 'Comunicación',
            icon: ChatBubbleLeftRightIcon,
            children: [
              { name: 'Mensajes', href: '/student/messages', icon: ChatBubbleLeftRightIcon },
            ]
          },
          { name: 'Mi Perfil', href: '/student/profile', icon: UserCircleIcon },
          { name: 'Ayuda', href: '/student/help', icon: QuestionMarkCircleIcon },
        ]
      case 'ADMIN_ESCOLAR':
        return [
          { name: 'Dashboard', href: '/school/dashboard', icon: HomeIcon },
          {
            name: 'Gestión Académica',
            icon: AcademicCapIcon,
            children: [
              { name: 'Gestión de Clases', href: '/school/classes', icon: AcademicCapIcon },
              { name: 'Horarios', href: '/school/timetable', icon: ClockIcon },
              { name: 'Currículo y OA', href: '/school/curriculum', icon: BookOpenIcon },
              { name: 'Planificaciones', href: '/school/lesson-plans', icon: DocumentDuplicateIcon },
            ]
          },
          {
            name: 'Evaluación y Notas',
            icon: DocumentTextIcon,
            children: [
              { name: 'Libro de Notas', href: '/school/gradebook', icon: DocumentTextIcon },
              { name: 'Control de Asistencia', href: '/school/attendance', icon: ClipboardDocumentCheckIcon },
            ]
          },
          {
            name: 'Reportes y Analíticas',
            icon: ChartBarIcon,
            children: [
              { name: 'Reportes Académicos', href: '/school/reports', icon: PresentationChartBarIcon },
              { name: 'Análisis y Métricas', href: '/school/reports', icon: DocumentChartBarIcon },
              { name: 'Laboratorios y Juegos', href: '/school/reports', icon: BeakerIcon },
              { name: 'Presupuesto IA', href: '/school/ai-budget', icon: CpuChipIcon },
            ]
          },
          {
            name: 'Administración',
            icon: CogIcon,
            children: [
              { name: 'Gestión de Usuarios', href: '/school/users', icon: UsersIcon },
              { name: 'Configuración', href: '/school/settings', icon: CogIcon },
            ]
          },
        ]
      case 'SOSTENEDOR':
        return [
          { name: 'Dashboard', href: '/sostenedor/dashboard', icon: HomeIcon },
          {
            name: 'Gestión de Red',
            icon: BuildingOfficeIcon,
            children: [
              { name: 'Colegios', href: '/sostenedor/schools', icon: BuildingOfficeIcon },
              { name: 'Usuarios de Red', href: '/sostenedor/users', icon: UsersIcon },
              { name: 'Licencias y Planes', href: '/sostenedor/licenses', icon: DocumentCheckIcon },
            ]
          },
          {
            name: 'Analíticas y KPI',
            icon: ChartBarIcon,
            children: [
              { name: 'Dashboard Ejecutivo', href: '/sostenedor/analytics', icon: PresentationChartBarIcon },
              { name: 'KPI Bloom/OA', href: '/sostenedor/bloom-analytics', icon: AcademicCapIcon },
              { name: 'Rendimiento Académico', href: '/sostenedor/academic-performance', icon: TrophyIcon },
              { name: 'Benchmarking', href: '/sostenedor/benchmarking', icon: ChartBarIcon },
            ]
          },
          {
            name: 'Finanzas y Presupuesto',
            icon: BanknotesIcon,
            children: [
              { name: 'Presupuesto IA', href: '/sostenedor/ai-budget', icon: CpuChipIcon },
              { name: 'Costos Operacionales', href: '/sostenedor/operational-costs', icon: BanknotesIcon },
              { name: 'ROI y Rentabilidad', href: '/sostenedor/roi-analysis', icon: CalculatorIcon },
              { name: 'Proyecciones', href: '/sostenedor/financial-projections', icon: ArrowTrendingUpIcon },
            ]
          },
          {
            name: 'Reportes Corporativos',
            icon: DocumentChartBarIcon,
            children: [
              { name: 'Reportes Ejecutivos', href: '/sostenedor/executive-reports', icon: DocumentChartBarIcon },
              { name: 'Análisis y Métricas', href: '/sostenedor/reports', icon: DocumentChartBarIcon },
              { name: 'Laboratorios y Juegos', href: '/sostenedor/reports', icon: BeakerIcon },
              { name: 'Reporte de Red', href: '/sostenedor/reports', icon: GlobeAltIcon },
              { name: 'Compliance y Auditoría', href: '/sostenedor/compliance', icon: ShieldCheckIcon },
              { name: 'Exportaciones Masivas', href: '/sostenedor/bulk-exports', icon: DocumentArrowDownIcon },
            ]
          },
          { name: 'Configuración Global', href: '/sostenedor/settings', icon: CogIcon },
        ]
      case 'BIENESTAR_ESCOLAR':
        return [
          { name: 'Dashboard', href: '/bienestar/dashboard', icon: HomeIcon },
          {
            name: 'Casos y Seguimiento',
            icon: ExclamationTriangleIcon,
            children: [
              { name: 'Estudiantes en Riesgo', href: '/bienestar/risk-students', icon: ExclamationTriangleIcon },
              { name: 'Casos PAI', href: '/bienestar/pai-cases', icon: DocumentTextIcon },
              { name: 'Intervenciones', href: '/bienestar/interventions', icon: HeartIcon },
              { name: 'Seguimiento y Monitoreo', href: '/bienestar/monitoring', icon: EyeIcon },
            ]
          },
          {
            name: 'Evaluación y Derivación',
            icon: ClipboardDocumentListIcon,
            children: [
              { name: 'Evaluaciones Psicosociales', href: '/bienestar/evaluations', icon: ClipboardDocumentListIcon },
              { name: 'Derivaciones', href: '/bienestar/referrals', icon: UserGroupIcon },
            ]
          },
          {
            name: 'Protocolos y Crisis',
            icon: ShieldCheckIcon,
            children: [
              { name: 'Protocolos de Crisis', href: '/bienestar/crisis-protocols', icon: ShieldCheckIcon },
              { name: 'Línea de Emergencia', href: '/bienestar/emergency-line', icon: PhoneIcon },
            ]
          },
          {
            name: 'Comunicación y Citas',
            icon: CalendarDaysIcon,
            children: [
              { name: 'Agenda y Citas', href: '/bienestar/appointments', icon: CalendarDaysIcon },
              { name: 'Comunicaciones', href: '/bienestar/communications', icon: ChatBubbleOvalLeftEllipsisIcon },
            ]
          },
          { name: 'Expedientes Digitales', href: '/bienestar/digital-records', icon: IdentificationIcon },
          { name: 'Reportes y Analíticas', href: '/bienestar/reports', icon: DocumentChartBarIcon },
          { name: 'Configuración', href: '/bienestar/settings', icon: AdjustmentsHorizontalIcon },
        ]
      case 'GUARDIAN':
        return [
          { name: 'Dashboard', href: '/guardian/dashboard', icon: HomeIcon },
          {
            name: 'Seguimiento Académico',
            icon: AcademicCapIcon,
            children: [
              { name: 'Progreso Académico', href: '/guardian/academic-progress', icon: ChartBarIcon },
              { name: 'Horario de Clases', href: '/guardian/schedule', icon: CalendarIcon },
              { name: 'Control de Asistencia', href: '/guardian/attendance', icon: ClockIcon },
              { name: 'Calificaciones y Notas', href: '/guardian/grades', icon: DocumentTextIcon },
              { name: 'Radar Bloom Personal', href: '/guardian/bloom-progress', icon: StarIcon },
            ]
          },
          {
            name: 'Comunicación y Apoyo',
            icon: ChatBubbleLeftRightIcon,
            children: [
              { name: 'Mensajes Profesores', href: '/guardian/messages', icon: ChatBubbleLeftRightIcon },
              { name: 'Casos de Apoyo PAI', href: '/guardian/support-cases', icon: HeartIcon },
              { name: 'Centro de Notificaciones', href: '/guardian/notifications', icon: BellIcon },
              { name: 'Comunicación Bienestar', href: '/guardian/bienestar-contact', icon: PhoneIcon },
              { name: 'Emergencias y Crisis', href: '/guardian/emergency-contact', icon: ExclamationTriangleIcon },
            ]
          },
          {
            name: 'Documentos y Reportes',
            icon: DocumentTextIcon,
            children: [
              { name: 'Reportes y Certificados', href: '/guardian/reports', icon: DocumentArrowDownIcon },
              { name: 'Historial Académico', href: '/guardian/academic-history', icon: BookOpenIcon },
              { name: 'Expediente Digital', href: '/guardian/digital-records', icon: IdentificationIcon },
              { name: 'Documentos PAI', href: '/guardian/pai-documents', icon: DocumentCheckIcon },
            ]
          },
          {
            name: 'Bienestar y Desarrollo',
            icon: HeartIcon,
            children: [
              { name: 'Dashboard Emocional', href: '/guardian/emotional-dashboard', icon: HeartIcon },
              { name: 'Seguimiento Psicosocial', href: '/guardian/psychosocial-tracking', icon: UserIcon },
              { name: 'Intervenciones Activas', href: '/guardian/active-interventions', icon: EyeIcon },
              { name: 'Citas y Evaluaciones', href: '/guardian/appointments', icon: CalendarDaysIcon },
            ]
          },
          {
            name: 'Actividades y Juegos',
            icon: PlayIcon,
            children: [
              { name: 'Progreso en Juegos', href: '/guardian/games-progress', icon: TrophyIcon },
              { name: 'Actividades Realizadas', href: '/guardian/activities', icon: PlayIcon },
              { name: 'Logros y Medallas', href: '/guardian/achievements', icon: StarIcon },
            ]
          },
          { name: 'Configuración', href: '/guardian/settings', icon: CogIcon },
        ]
      case 'SUPER_ADMIN_FULL':
        return [
          { name: 'Dashboard V1', href: '/admin/dashboard', icon: HomeIcon },
          {
            name: 'Gestión de Red',
            icon: BuildingOfficeIcon,
            children: [
              { name: 'Administración de Escuelas', href: '/admin/schools', icon: BuildingOfficeIcon },
              { name: 'Usuarios del Sistema', href: '/admin/users', icon: UsersIcon },
              { name: 'Licencias y Planes', href: '/admin/licenses', icon: DocumentCheckIcon },
              { name: 'Onboarding Escuelas', href: '/admin/onboarding', icon: AcademicCapIcon },
            ]
          },
          {
            name: 'Monitoreo y Salud',
            icon: ChartBarIcon,
            children: [
              { name: 'Monitoreo de IA', href: '/admin/ai-monitoring', icon: CpuChipIcon },
              { name: 'Estado del Sistema', href: '/admin/system-health', icon: HeartIcon },
              { name: 'Métricas de Rendimiento', href: '/admin/performance', icon: PresentationChartBarIcon },
              { name: 'Alertas y Notificaciones', href: '/admin/alerts', icon: ExclamationTriangleIcon },
            ]
          },
          {
            name: 'Seguridad y Auditoría',
            icon: ShieldCheckIcon,
            children: [
              { name: 'Logs de Seguridad', href: '/admin/security', icon: ShieldCheckIcon },
              { name: 'Gestión de MFA', href: '/admin/mfa-management', icon: DocumentCheckIcon },
              { name: 'Políticas de Acceso', href: '/admin/access-policies', icon: IdentificationIcon },
              { name: 'Auditoría de Sistema', href: '/admin/audit-logs', icon: DocumentTextIcon },
            ]
          },
          {
            name: 'IA y Presupuestos',
            icon: CpuChipIcon,
            children: [
              { name: 'Configuración de IA', href: '/admin/ai-config', icon: CpuChipIcon },
              { name: 'Presupuestos por Escuela', href: '/admin/ai-budgets', icon: BanknotesIcon },
              { name: 'Consumo y Costos', href: '/admin/ai-costs', icon: CalculatorIcon },
              { name: 'APIs y Integraciones', href: '/admin/api-management', icon: CogIcon },
            ]
          },
          {
            name: 'Reportes Corporativos',
            icon: DocumentChartBarIcon,
            children: [
              { name: 'Dashboard Ejecutivo', href: '/admin/executive-dashboard', icon: DocumentChartBarIcon },
              { name: 'Análisis y Métricas', href: '/admin/reports', icon: DocumentChartBarIcon },
              { name: 'Laboratorios y Juegos', href: '/admin/reports', icon: BeakerIcon },
              { name: 'Reportes de Uso', href: '/admin/usage-reports', icon: DocumentArrowDownIcon },
              { name: 'Compliance y Legal', href: '/admin/compliance', icon: DocumentCheckIcon },
              { name: 'Exportaciones Masivas', href: '/admin/bulk-exports', icon: DocumentDuplicateIcon },
            ]
          },
          {
            name: 'Módulo Laboratorios',
            icon: BeakerIcon,
            children: [
              { name: 'Gestión de Material', href: '/admin/lab-management', icon: FolderIcon },
              { name: 'Catálogo de Actividades', href: '/admin/lab/activities', icon: BookOpenIcon },
              { name: 'Dashboard de Impacto', href: '/admin/lab/dashboard', icon: ChartBarIcon },
            ]
          },
          {
            name: 'Administración',
            icon: CogIcon,
            children: [
              { name: 'Configuración Global', href: '/admin/settings', icon: CogIcon },
              { name: 'Gestión de Backups', href: '/admin/backups', icon: DocumentArrowDownIcon },
              { name: 'Mantenimiento', href: '/admin/maintenance', icon: AdjustmentsHorizontalIcon },
              { name: 'Soporte Técnico', href: '/admin/support', icon: QuestionMarkCircleIcon },
            ]
          },
        ]
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  const renderNavigationItems = (items: NavigationItem[], isMobile = false) => {
    return items.map((item) => {
      if (item.children) {
        return (
          <Disclosure as="div" key={item.name}>
            {({ open }) => (
              <>
                <Disclosure.Button className={cn(
                  "nav-link nav-link-inactive w-full flex items-center justify-between",
                  isMobile && "nav-mobile"
                )}>
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 shrink-0 mr-3" aria-hidden="true" />
                    <span className="text-mobile-sm">{item.name}</span>
                  </div>
                  <ChevronDownIcon
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      open ? 'rotate-180' : ''
                    )}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="mt-1 space-y-1">
                  {item.children?.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href!}
                      className={cn(
                        'nav-link pl-12',
                        pathname === child.href ? 'nav-link-active' : 'nav-link-inactive',
                        isMobile && "text-mobile-sm"
                      )}
                      onClick={() => isMobile && setSidebarOpen(false)}
                    >
                      <child.icon className="h-4 w-4 shrink-0 mr-3" aria-hidden="true" />
                      <span>{child.name}</span>
                    </Link>
                  ))}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        )
      }

      return (
        <Link
          key={item.name}
          href={item.href!}
          className={cn(
            'nav-link',
            pathname === item.href ? 'nav-link-active' : 'nav-link-inactive',
            isMobile && "nav-mobile text-mobile-sm"
          )}
          onClick={() => isMobile && setSidebarOpen(false)}
        >
          <item.icon className="h-5 w-5 shrink-0 mr-3" aria-hidden="true" />
          <span>{item.name}</span>
        </Link>
      )
    })
  }

  return (
    <div className="h-full flex">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5 touch-manipulation"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Cerrar sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-4 pb-4 safe-area-inset">
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-white">E21</span>
                    </div>
                    <span className="ml-2 text-xl font-bold text-gray-900">EDU21</span>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {renderNavigationItems(navigationItems, true)}
                        </ul>
                      </li>
                      
                      {/* Mobile Support section */}
                      <li className="mt-auto">
                        <ul role="list" className="-mx-2 space-y-1">
                          <li>
                            <Link
                              href="/help"
                              className="nav-link nav-link-inactive nav-mobile text-mobile-sm"
                              onClick={() => setSidebarOpen(false)}
                            >
                              <QuestionMarkCircleIcon className="h-5 w-5 shrink-0 mr-3" aria-hidden="true" />
                              Ayuda
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/settings"
                              className="nav-link nav-link-inactive nav-mobile text-mobile-sm"
                              onClick={() => setSidebarOpen(false)}
                            >
                              <CogIcon className="h-5 w-5 shrink-0 mr-3" aria-hidden="true" />
                              Configuración Personal
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={() => {
                                logout()
                                router.push('/login')
                                toast.success('Sesión cerrada exitosamente')
                                setSidebarOpen(false)
                              }}
                              className="nav-link nav-link-inactive nav-mobile text-mobile-sm w-full text-left"
                            >
                              <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0 mr-3" aria-hidden="true" />
                              Cerrar Sesión
                            </button>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-white">E21</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">EDU21</span>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {renderNavigationItems(navigationItems)}
                </ul>
              </li>
              
              {/* Support section */}
              <li className="mt-auto">
                <ul role="list" className="-mx-2 space-y-1">
                  <li>
                    <Link
                      href="/help"
                      className="nav-link nav-link-inactive"
                    >
                      <QuestionMarkCircleIcon className="h-5 w-5 shrink-0 mr-3" aria-hidden="true" />
                      Ayuda
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/settings"
                      className="nav-link nav-link-inactive"
                    >
                      <CogIcon className="h-5 w-5 shrink-0 mr-3" aria-hidden="true" />
                      Configuración Personal
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout()
                        router.push('/login')
                        toast.success('Sesión cerrada exitosamente')
                      }}
                      className="nav-link nav-link-inactive w-full text-left"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0 mr-3" aria-hidden="true" />
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col flex-1">
        <div className="dashboard-header">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden touch-manipulation"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1"></div>
            <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">

              
              {/* Notification Bell */}
              {user?.role === 'STUDENT' && (
                <NotificationBell />
              )}

              {/* Profile dropdown */}
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.email || 'Usuario'}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.role?.replace('_', ' ') || 'Sin rol'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  )
} 