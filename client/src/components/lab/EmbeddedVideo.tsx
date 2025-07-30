
'use client'

import React from 'react';

interface EmbeddedVideoProps {
  videoUrl: string;
}

const EmbeddedVideo: React.FC<EmbeddedVideoProps> = ({ videoUrl }) => {
  if (!videoUrl) {
    return <p>No hay video disponible para esta actividad.</p>;
  }

  // Basic embedding for YouTube/Vimeo. In a real app, you'd handle different providers.
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return '';
  };

  const embedSrc = getEmbedUrl(videoUrl);

  if (!embedSrc) {
    return <p>Formato de URL de video no soportado.</p>;
  }

  return (
    <div className="aspect-w-16 aspect-h-9 w-full">
      <iframe
        src={embedSrc}
        title="Embedded video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg shadow-lg"
      ></iframe>
    </div>
  );
};

export default EmbeddedVideo;
