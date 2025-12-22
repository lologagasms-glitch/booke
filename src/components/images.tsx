// components/ImageWithFallback.tsx
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { LoaderIcon } from 'react-hot-toast';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  timeout?: number;
  retryAttempts?: number;
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = '/placeholder-image.jpg',
  timeout = 10000, // 10 seconds
  retryAttempts = 2
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsLoading(true);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    if (retryCount < retryAttempts) {
      setRetryCount(prev => prev + 1);
      // Retry with timestamp to avoid cache
      setImgSrc(`${src}${src.includes('?') ? '&' : '?'}retry=${Date.now()}`);
    } else {
      setHasError(true);
      setIsLoading(false);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  if (hasError && imgSrc === fallbackSrc) {
    return (
      <div className={`relative bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <LoaderIcon/>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        unoptimized={imgSrc.includes('pexels.com')} // Bypass Next.js optimization for external images
      />
    </div>
  );
}