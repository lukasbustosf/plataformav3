'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  CalendarIcon,
  ClockIcon,
  BookOpenIcon,
  UserIcon,
  MapPinIcon,
  BellIcon,
  DocumentTextIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export default function SchedulePage() {
  const { user } = useAuth()
  const [selectedWeek, setSelectedWeek] = useState('2024-W51')
  const [selectedView, setSelectedView] = useState('week')

  // Mock data for child's schedule
  const childData = {
    name: 'SofÃ­a MartÃ­nez',
    grade: '7Â° BÃ¡sico A',
    classroom: 'Sala 15',
    teacherGuide: 'Prof. MarÃ­a GonzÃ¡lez'
  }

  const weekDays = ['Lunes', 'Martes', 'MiÃ©rcoles', 'Jueves', 'Viernes']

  const schedule: { [key: string]: any[] } = {
    'Lunes': [
      { time: '08:00-08:45', subject: 'MatemÃ¡ticas', teacher: 'Prof. Carlos PÃ©rez', room: 'Sala 12', type: 'regular' },
      { time: '08:45-09:30', subject: 'MatemÃ¡ticas', teacher: 'Prof. Carlos PÃ©rez', room: 'Sala 12', type: 'regular' },
      { time: '09:30-09:45', subject: 'Recreo', teacher: '', room: 'Patio', type: 'break' },
      { time: '09:45-10:30', subject: 'Lenguaje', teacher: 'Prof. MarÃ­a GonzÃ¡lez', room: 'Sala 15', type: 'regular' },
      { time: '10:30-11:15', subject: 'Lenguaje', teacher: 'Prof. MarÃ­a GonzÃ¡lez', room: 'Sala 15', type: 'regular' },
      { time: '11:15-11:30', subject: 'Recreo', teacher: '', room: 'Patio', type: 'break' },
      { time: '11:30-12:15', subject: 'Ciencias', teacher: 'Prof. Ana RodrÃ­guez', room: 'Lab. Ciencias', type: 'lab' },
      { time: '12:15-13:00', subject: 'Historia', teacher: 'Prof. Luis FernÃ¡ndez', room: 'Sala 18', type: 'regular' }
    ],
    'Martes': [
      { time: '08:00-08:45', subject: 'InglÃ©s', teacher: 'Prof. Jennifer Smith', room: 'Sala 20', type: 'regular' },
      { time: '08:45-09:30', subject: 'InglÃ©s', teacher: 'Prof. Jennifer Smith', room: 'Sala 20', type: 'regular' },
      { time: '09:30-09:45', subject: 'Recreo', teacher: '', room: 'Patio', type: 'break' },
      { time: '09:45-10:30', subject: 'MatemÃ¡ticas', teacher: 'Prof. Carlos PÃ©rez', room: 'Sala 12', type: 'regular' },
      { time: '10:30-11:15', subject: 'Ed. FÃ­sica', teacher: 'Prof. Roberto DÃ­az', room: 'Gimnasio', type: 'physical' },
      { time: '11:15-11:30', subject: 'Recreo', teacher: '', room: 'Patio', type: 'break' },
      { time: '11:30-12:15', subject: 'Ed. FÃ­sica', teacher: 'Prof. Roberto DÃ­az', room: 'Gimnasio', type: 'physical' },
      { time: '12:15-13:00', subject: 'OrientaciÃ³n', teacher: 'Prof. MarÃ­a GonzÃ¡lez', room: 'Sala 15', type: 'guidance' }
    ],
    'MiÃ©rcoles': [
      { time: '08:00-08:45', subject: 'Ciencias', teacher: 'Prof. Ana RodrÃ­guez', room: 'Sala 16', type: 'regular' },
      { time: '08:45-09:30', subject: 'Ciencias', teacher: 'Prof. Ana RodrÃ­guez', room: 'Sala 16', type: 'regular' },
      { time: '09:30-09:45', subject: 'Recreo', teacher: '', room: 'Patio', type: 'break' },
      { time: '09:45-10:30', subject: 'Historia', teacher: 'Prof. Luis FernÃ¡ndez', room: 'Sala 18', type: 'regular' },
      { time: '10:30-11:15', subject: 'Historia', teacher: 'Prof. Luis FernÃ¡ndez', room: 'Sala 18', type: 'regular' },
      { time: '11:15-11:30', subject: 'Recreo', teacher: '', room: 'Patio', type: 'break' },
      { time: '11:30-12:15', subject: 'Arte', teacher: 'Prof. Carmen Vega', room: 'Taller Arte', type: 'art' },
      { time: '12:15-13:00', subject: 'MÃºsica', teacher: 'Prof. Pedro Silva', room: 'Sala MÃºsica', type: 'art' }
    ],
    'Jueves': [
      { time: '08:00-08:45', subject: 'MatemÃ¡ticas', teacher: 'Prof. Carlos PÃ©rez', room: 'Sala 12', type: 'regular' },
      { time: '08:45-09:30', subject: 'MatemÃ¡ticas', teacher: 'Prof. Carlos PÃ©rez', room: 'Sala 12', type: 'regular' },
      { time: '09:30-09:45', subject: 'Recreo', teacher: '', room: 'Patio', type: 'break' },
      { time: '09:45-10:30', subject: 'Lenguaje', teacher: 'Prof. MarÃ­a GonzÃ¡lez', room: 'Sala 15', type: 'regular' },
      { time: '10:30-11:15', subject: 'TecnologÃ­a', teacher: 'Prof. Miguel Torres', room: 'Lab. ComputaciÃ³n', type: 'tech' },
      { time: '11:15-11:30', subject: 'Recreo', teacher: '', room: 'Patio', type: 'break' },
      { time: '11:30-12:15', subject: 'TecnologÃ­a', teacher: 'Prof. Miguel Torres', room: 'Lab. ComputaciÃ³n', type: 'tech' },
      { time: '12:15-13:00', subject: 'ReligiÃ³n', teacher: 'Prof. Isabel Morales', room: 'Sala 22', type: 'regular' }
    ],
    'Viernes': [
      { time: '08:00-08:45', subject: 'InglÃ©s', teacher: 'Prof. Jennifer Smith', room: 'Sala 20', type: 'regular' },
      { time: '08:45-09:30', subject: 'Ciencias', teacher: 'Prof. Ana RodrÃ­guez', room: 'Lab. Ciencias', type: 'lab' },
      { time: '09:30-09:45', subject: 'Recreo', teacher: '', room: 'Patio', type: 'break' },
      { time: '09:45-10:30', subject: 'Lenguaje', teacher: 'Prof. MarÃ­a GonzÃ¡lez', room: 'Sala 15', type: 'regular' },
      { time: '10:30-11:15', subject: 'Historia', teacher: 'Prof. Luis FernÃ¡ndez', room: 'Sala 18', type: 'regular' },
      { time: '11:15-11:30', subject: 'Recreo', teacher: '', room: 'Patio', type: 'break' },
      { time: '11:30-12:15', subject: 'Consejo de Curso', teacher: 'Prof. MarÃ­a GonzÃ¡lez', room: 'Sala 15', type: 'guidance' },
      { time: '12:15-13:00', subject: 'Tiempo Libre', teacher: '', room: 'Biblioteca', type: 'free' }
    ]
  }

  const upcomingEvents = [
    {
      id: 1,
      title: 'Examen de MatemÃ¡ticas',
      date: '2024-12-18',
      time: '08:00',
      subject: 'MatemÃ¡ticas',
      teacher: 'Prof. Carlos PÃ©rez',
      type: 'exam',
      description: 'Examen de Ã¡lgebra y geometrÃ­a'
    },
    {
      id: 2,
      title: 'PresentaciÃ³n Historia',
      date: '2024-12-19',
      time: '10:30',
      subject: 'Historia',
      teacher: 'Prof. Luis FernÃ¡ndez',
      type: 'presentation',
      description: 'PresentaciÃ³n grupal sobre la Independencia'
    },
    {
      id: 3,
      title: 'ReuniÃ³n de Apoderados',
      date: '2024-12-20',
      time: '19:00',
      subject: 'General',
      teacher: 'Prof. MarÃ­a GonzÃ¡lez',
      type: 'meeting',
      description: 'ReuniÃ³n general de apoderados 7Â° BÃ¡sico A'
    },
    {
      id: 4,
      title: 'Entrega Ensayo Lenguaje',
      date: '2024-12-21',
      time: '09:45',
      subject: 'Lenguaje',
      teacher: 'Prof. MarÃ­a GonzÃ¡lez',
      type: 'assignment',
      description: 'Fecha lÃ­mite entrega ensayo literatura contemporÃ¡nea'
    }
  ]

  const scheduleChanges = [
    {
      id: 1,
      date: '2024-12-17',
      change: 'SuspensiÃ³n clase Ed. FÃ­sica',
      reason: 'CapacitaciÃ³n docente',
      replacement: 'Estudio dirigido en biblioteca',
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2024-12-19',
      change: 'Cambio horario Ciencias',
      reason: 'MantenciÃ³n laboratorio',
      replacement: 'Clase teÃ³rica en Sala 16',
      status: 'confirmed'
    }
  ]

  const getSubjectColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'regular': 'bg-blue-100 text-blue-800',
      'lab': 'bg-green-100 text-green-800',
      'physical': 'bg-red-100 text-red-800',
      'art': 'bg-purple-100 text-purple-800',
      'tech': 'bg-yellow-100 text-yellow-800',
      'guidance': 'bg-indigo-100 text-indigo-800',
      'break': 'bg-gray-100 text-gray-800',
      'free': 'bg-gray-50 text-gray-600'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam': return <DocumentTextIcon className="h-4 w-4" />
      case 'presentation': return <UserIcon className="h-4 w-4" />
      case 'meeting': return <BellIcon className="h-4 w-4" />
      case 'assignment': return <BookOpenIcon className="h-4 w-4" />
      default: return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getEventColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'exam': 'border-red-200 bg-red-50',
      'presentation': 'border-blue-200 bg-blue-50',
      'meeting': 'border-purple-200 bg-purple-50',
      'assignment': 'border-yellow-200 bg-yellow-50'
    }
    return colors[type] || 'border-gray-200 bg-gray-50'
  }

  const handleSyncCalendar = () => {
    toast.success('Sincronizando horario con calendario personal...')
    
    setTimeout(() => {
      toast.success('Horario sincronizado exitosamente')
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Horario de Clases ðŸ“š</h1>
          <p className="mt-2 opacity-90">
            Horario semanal y eventos de {childData.name} en {childData.grade}
          </p>
        </div>

        {/* Student Info */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Profesor Jefe</div>
                  <div className="text-sm text-gray-600">{childData.teacherGuide}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Sala Base</div>
                  <div className="text-sm text-gray-600">{childData.classroom}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Curso</div>
                  <div className="text-sm text-gray-600">{childData.grade}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semana</label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="2024-W51">16-20 Diciembre 2024</option>
                  <option value="2024-W50">9-13 Diciembre 2024</option>
                  <option value="2024-W49">2-6 Diciembre 2024</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vista</label>
                <select
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="week">Vista Semanal</option>
                  <option value="day">Vista Diaria</option>
                  <option value="list">Vista Lista</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={handleSyncCalendar}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Sincronizar
              </Button>
            </div>
          </div>
        </div>

        {/* Schedule Changes Alert */}
        {scheduleChanges.length > 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Cambios en el Horario</h2>
            </div>
            <div className="p-6 space-y-4">
              {scheduleChanges.map((change) => (
                <div
                  key={change.id}
                  className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
                >
                  <div className="flex items-start">
                    <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {change.change} - {new Date(change.date).toLocaleDateString()}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Motivo:</strong> {change.reason}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Reemplazo:</strong> {change.replacement}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Confirmado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Schedule */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Horario Semanal</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-6 gap-4">
              {/* Time column */}
              <div className="space-y-2">
                <div className="h-12 flex items-center justify-center text-sm font-medium text-gray-900">
                  Hora
                </div>
                {schedule['Lunes']?.map((slot, index) => (
                  <div key={index} className="h-16 flex items-center justify-center text-xs text-gray-600 border-r border-gray-200">
                    {slot.time}
                  </div>
                ))}
              </div>
              
              {/* Day columns */}
              {weekDays.map((day) => (
                <div key={day} className="space-y-2">
                  <div className="h-12 flex items-center justify-center text-sm font-medium text-gray-900 bg-gray-50 rounded">
                    {day}
                  </div>
                  {schedule[day]?.map((slot, index) => (
                    <div 
                      key={index} 
                      className={`h-16 rounded p-2 text-xs ${getSubjectColor(slot.type)}`}
                    >
                      <div className="font-medium truncate">{slot.subject}</div>
                      {slot.teacher && (
                        <div className="text-xs opacity-75 truncate">{slot.teacher}</div>
                      )}
                      {slot.room && (
                        <div className="text-xs opacity-75 truncate">{slot.room}</div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">PrÃ³ximos Eventos</h2>
          </div>
          <div className="p-6 space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className={`border rounded-lg p-4 ${getEventColor(event.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {event.time}
                        </span>
                        <span className="flex items-center">
                          <UserIcon className="h-3 w-3 mr-1" />
                          {event.teacher}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {event.subject}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Summary */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Resumen Semanal por Asignatura</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { subject: 'MatemÃ¡ticas', hours: 6, teacher: 'Prof. Carlos PÃ©rez' },
                { subject: 'Lenguaje', hours: 4, teacher: 'Prof. MarÃ­a GonzÃ¡lez' },
                { subject: 'Ciencias', hours: 4, teacher: 'Prof. Ana RodrÃ­guez' },
                { subject: 'Historia', hours: 3, teacher: 'Prof. Luis FernÃ¡ndez' },
                { subject: 'InglÃ©s', hours: 3, teacher: 'Prof. Jennifer Smith' },
                { subject: 'Ed. FÃ­sica', hours: 2, teacher: 'Prof. Roberto DÃ­az' }
              ].map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{item.subject}</h3>
                    <span className="text-sm text-gray-600">{item.hours}h</span>
                  </div>
                  <p className="text-xs text-gray-600">{item.teacher}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-indigo-600 h-1 rounded-full" 
                        style={{ width: `${(item.hours / 6) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 
