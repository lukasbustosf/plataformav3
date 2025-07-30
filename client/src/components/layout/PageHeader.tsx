// src/components/layout/PageHeader.tsx
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6 border-b border-gray-200 pb-4">
      <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-1 max-w-2xl text-sm text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}
