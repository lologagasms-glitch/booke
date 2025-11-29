'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllMediaImages } from '../lib/services/etablissement.service';
import { Carousel } from '../api/carousel/route';

export const carouselKeys = {
  all: ['carousel'] as const,
};

export default function useCarousel(limit = 10) {
  return useQuery({
    queryKey: [...carouselKeys.all, limit],
    queryFn: async (): Promise<Carousel> => {
      const response = await fetch(`/api/carousel?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Carousel fetch failed: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
}