'use client'

import React from 'react';

interface PedagogicalSheetProps {
  objectivesMarkdown?: string;
  indicatorsMarkdown?: string;
}

const PedagogicalSheet: React.FC<PedagogicalSheetProps> = ({ objectivesMarkdown, indicatorsMarkdown }) => {
  // Helper function to render markdown content safely
  const renderMarkdown = (markdown: string | undefined) => {
    if (!markdown) return <p className="text-gray-500">No disponible.</p>;
    // Simple conversion of markdown-like lists to HTML
    const html = markdown
      .replace(/^OA \d+/gm, (match) => `<strong>${match}</strong>`)
      .replace(/^- /gm, '<br />- ')
      .replace(/\n/g, '<br />');
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Ficha Pedagógica</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Objetivos de Aprendizaje (OAs)</h3>
          <div className="prose prose-sm max-w-none text-gray-600">
            {renderMarkdown(objectivesMarkdown)}
          </div>
        </div>
        
        {indicatorsMarkdown && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Indicadores de Evaluación</h3>
            <div className="prose prose-sm max-w-none text-gray-600">
              {renderMarkdown(indicatorsMarkdown)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedagogicalSheet;
