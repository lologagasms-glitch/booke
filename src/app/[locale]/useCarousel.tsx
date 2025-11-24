'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllMediaImages } from '../lib/services/etablissement.service';

export const carouselKeys = {
  all: ['carousel'] as const,
};

export default function useCarousel(limit = 10) {
  return useQuery({
    queryKey: carouselKeys.all,
    queryFn: () => getAllMediaImages(limit),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}