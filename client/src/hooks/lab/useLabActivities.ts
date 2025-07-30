
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

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
      if (!response.ok) { // Corrected: check for !response.ok
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
      if (!response.ok) { // Corrected: check for !response.ok
        throw new Error('Actividad no encontrada')
      }
      return response.json()
    },
    enabled: !!slug, // Ensure slug is truthy before enabling query
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

      if (!response.ok) { // Corrected: check for !response.ok
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
      toast.error('❌ Error al registrar: ' + (error as Error).message)
    }
  })
}
