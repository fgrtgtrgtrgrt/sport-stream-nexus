
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { StreamLink } from '@/pages/Index';

interface StreamPlayerProps {
  stream: StreamLink;
  onStreamError: () => void;
}

export const StreamPlayer = ({ stream, onStreamError }: StreamPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [stream]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    console.log('Stream loaded successfully:', stream.server);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error('Stream failed to load:', stream.server);
    onStreamError();
  };

  const getEmbedUrl = (url: string) => {
    // Convert various stream URLs to embeddable format
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    }
    
    if (url.includes('twitch.tv')) {
      const channel = url.split('/').pop();
      return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}&autoplay=true&muted=true`;
    }
    
    // For other streaming services, return as-is (assuming they're already embed-ready)
    return url;
  };

  if (hasError) {
    return (
      <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2">Stream Error</h3>
          <p className="text-slate-400 mb-4">
            This stream is currently unavailable
          </p>
          <Button onClick={onStreamError}>
            Try Another Server
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400">Loading stream...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={getEmbedUrl(stream.url)}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title={`${stream.server} Stream`}
      />
      
      {/* Stream Info Overlay */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-white">{stream.server}</span>
          <span className="text-slate-300">({stream.quality})</span>
        </div>
      </div>
    </div>
  );
};
