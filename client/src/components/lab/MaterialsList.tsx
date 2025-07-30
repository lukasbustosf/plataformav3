
'use client'

import React from 'react';

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  imageUrl?: string;
}

interface MaterialsListProps {
  materials: Material[];
}

const MaterialsList: React.FC<MaterialsListProps> = ({ materials }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Materiales Requeridos</h2>
      {materials.length === 0 ? (
        <p>No hay materiales específicos listados para esta actividad.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((material) => (
            <li key={material.id} className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
              {material.imageUrl && (
                <img src={material.imageUrl} alt={material.name} className="w-16 h-16 object-cover rounded" />
              )}
              <div>
                <h3 className="font-semibold">{material.name}</h3>
                <p className="text-gray-600">{material.quantity} {material.unit}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MaterialsList;
