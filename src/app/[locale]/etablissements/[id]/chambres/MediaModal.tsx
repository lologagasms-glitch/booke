'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useEffect } from 'react';

type Media = {
  id?: string;
  createdAt: Date;
  type: "image" | "video";
  chambreId?: string;
  url: string;
  filename: string;
}

export default function MediaModal({ media, onClose }: { media: Media; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
        >
          <XMarkIcon className="h-6 w-6 text-gray-800" />
        </button>

        {media.type === 'image' ? (
          <Image
            src={media.url}
            alt="Aperçu"
            width={1200}
            height={800}
            className="object-contain w-full h-full"
          />
        ) : (
          <video
            src={media.url}
            controls
            autoPlay
            className="max-w-full max-h-full"
          />
        )}
      </div>
    </div>
  );
}