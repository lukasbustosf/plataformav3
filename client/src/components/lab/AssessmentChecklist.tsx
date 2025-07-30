
'use client'

import React from 'react';

interface AssessmentChecklistProps {
  markdown: string;
}

const AssessmentChecklist: React.FC<AssessmentChecklistProps> = ({ markdown }) => {
  // In a real application, you would parse the markdown to create interactive checkboxes
  return (
    <div className="prose max-w-none">
      <h2>Evaluación</h2>
      <div dangerouslySetInnerHTML={{ __html: markdown }} />
      <p className="mt-4 text-gray-600">
        (Nota: En una implementación completa, esto sería un checklist interactivo.)
      </p>
    </div>
  );
};

export default AssessmentChecklist;
