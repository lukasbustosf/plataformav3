'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  BellIcon,
  CheckCircleIcon,
  EnvelopeOpenIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Notification {
  id: string;
  title: string;
  message: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export default function StudentNotificationsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!user?.user_id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getNotifications();
      setNotifications(response.notifications);
    } catch (err) {
      setError('Error al cargar las notificaciones.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && user?.user_id) {
      fetchNotifications();
    }
  }, [user?.user_id, isAuthLoading]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      toast.success('Notificación marcada como leída.');
      fetchNotifications(); // Refresh list
    } catch (err) {
      toast.error('Error al marcar como leída.');
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      toast.success('Todas las notificaciones marcadas como leídas.');
      fetchNotifications(); // Refresh list
    } catch (err) {
      toast.error('Error al marcar todas como leídas.');
      console.error(err);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BellIcon className="h-8 w-8 text-blue-500" />
            Mis Notificaciones
          </h1>
          {notifications.filter(n => !n.read_at).length > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="secondary">
              <EnvelopeOpenIcon className="h-5 w-5 mr-2" />
              Marcar todas como leídas
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <BellIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tienes notificaciones</h3>
            <p className="mt-1 text-sm text-gray-500">Mantente atento, aquí aparecerán tus nuevas asignaciones y avisos.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white shadow rounded-lg p-4 flex items-start space-x-4 ${
                  notification.read_at ? 'opacity-70' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  {notification.read_at ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <BellIcon className="h-6 w-6 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900">{notification.title}</h2>
                  <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                  {notification.link && (
                    <Link href={notification.link} className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                      Ver detalles
                    </Link>
                  )}
                </div>
                <div className="flex-shrink-0 flex flex-col space-y-2">
                  {!notification.read_at && (
                    <Button
                      onClick={() => handleMarkAsRead(notification.id)}
                      variant="ghost"
                      size="sm"
                      title="Marcar como leída"
                    >
                      <EnvelopeOpenIcon className="h-5 w-5" />
                    </Button>
                  )}
                  {/* Add delete functionality if needed */}
                  {/* <Button
                    onClick={() => handleDeleteNotification(notification.id)}
                    variant="ghost"
                    size="sm"
                    title="Eliminar"
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </Button> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
