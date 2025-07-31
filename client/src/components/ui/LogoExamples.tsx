import React from 'react';
import Logo from './Logo';

const LogoExamples: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        OALabs - Ejemplos de Logo
      </h1>
      
      {/* Logo Horizontal */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Logo Horizontal (Principal)</h2>
        <div className="flex items-center space-x-4">
          <Logo variant="horizontal" size="sm" />
          <Logo variant="horizontal" size="md" />
          <Logo variant="horizontal" size="lg" />
          <Logo variant="horizontal" size="xl" />
        </div>
      </div>

      {/* Logo Compact */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Logo Compact (Sidebar)</h2>
        <div className="flex items-center space-x-4">
          <Logo variant="compact" size="sm" />
          <Logo variant="compact" size="md" />
          <Logo variant="compact" size="lg" />
        </div>
      </div>

      {/* Logo Vertical */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Logo Vertical</h2>
        <div className="flex items-center space-x-4">
          <Logo variant="vertical" size="md" />
          <Logo variant="vertical" size="lg" />
        </div>
      </div>

      {/* Logo Minimal */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Logo Minimal</h2>
        <div className="flex items-center space-x-4">
          <Logo variant="minimal" size="sm" />
          <Logo variant="minimal" size="md" />
        </div>
      </div>

      {/* Logo Icon Only */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Logo Icon Only</h2>
        <div className="flex items-center space-x-4">
          <Logo variant="iconOnly" size="sm" />
          <Logo variant="iconOnly" size="md" />
          <Logo variant="iconOnly" size="lg" />
        </div>
      </div>

      {/* Logo Dark */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Logo Dark Theme</h2>
        <div className="bg-gray-900 p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <Logo variant="dark" size="md" />
            <Logo variant="dark" size="lg" />
          </div>
        </div>
      </div>

      {/* Ejemplos de uso */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Ejemplos de Uso</h2>
        
        {/* Header */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Header</h3>
          <div className="flex items-center justify-between">
            <Logo variant="horizontal" size="md" />
            <div className="text-sm text-gray-500">Navegación aquí</div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Sidebar</h3>
          <div className="flex items-center">
            <Logo variant="compact" size="md" />
          </div>
        </div>

        {/* Mobile */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Mobile Header</h3>
          <div className="flex items-center justify-between">
            <Logo variant="minimal" size="sm" />
            <div className="text-sm text-gray-500">Menú</div>
          </div>
        </div>

        {/* Login */}
        <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Login Page</h3>
          <div className="text-center">
            <Logo variant="horizontal" size="lg" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Inicia sesión en OALabs
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoExamples; 