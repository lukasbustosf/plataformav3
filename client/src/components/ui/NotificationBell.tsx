'use client'

import React from 'react';
import Link from 'next/link';
import { BellIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const NotificationBell: React.FC = () => {
  const { data, isLoading, error } = useQuery(
    ['notifications'],
    () => api.getNotifications(),
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );

  const unreadCount = data?.unread_count || 0;

  return (
    <Link href="/student/notifications" className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
      <span className="sr-only">View notifications</span>
      <BellIcon className="h-6 w-6" aria-hidden="true" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
