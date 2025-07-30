'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button } from '@/components/ui/button'

interface ResponsiveModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  mobileFullScreen?: boolean
}

export function ResponsiveModal({ 
  open, 
  onClose, 
  title, 
  children, 
  size = 'md',
  mobileFullScreen = false
}: ResponsiveModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full ${mobileFullScreen ? 'max-w-full mx-4' : sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}>
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {title}
                </Dialog.Title>
                <div className="mt-4">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export function FormModal({ 
  open, 
  onClose, 
  title, 
  children, 
  onSubmit,
  submitText = "Guardar",
  loading = false,
  submitDisabled = false
}: ResponsiveModalProps & {
  onSubmit?: () => void
  submitText?: string
  loading?: boolean
  submitDisabled?: boolean
}) {
  return (
    <ResponsiveModal open={open} onClose={onClose} title={title}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit?.() }}>
        {children}
        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || submitDisabled}>
            {loading ? 'Guardando...' : submitText}
          </Button>
        </div>
      </form>
    </ResponsiveModal>
  )
} 