
'use client'

import React from 'react';

interface GuideStepsMarkdownProps {
  markdown: string;
}

const GuideStepsMarkdown: React.FC<GuideStepsMarkdownProps> = ({ markdown }) => {
  // In a real application, you would use a markdown renderer library here
  return (
    <div className="prose max-w-none">
      <h2>Guía Paso a Paso</h2>
      <div dangerouslySetInnerHTML={{ __html: markdown }} />
    </div>
  );
};

export default GuideStepsMarkdown;
