// hooks/etablissement.ts
"use client"
import { DataEtabsPopularType } from '@/app/api/etablissement/getPopular/route';
import { useQuery } from '@tanstack/react-query';
export function usePopularEtablissements(opts?: { limit?: number }) {
   return useQuery<DataEtabsPopularType>({
    queryKey: ['popular-etablissements', opts?.limit ?? 10],
    queryFn: async (): Promise<DataEtabsPopularType> => {
      const response = await fetch(`/api/etablissement/getPopular?limit=${opts?.limit ?? 10}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  });
}

/*  type inféré  →  useQuery<{
        data: { etablissementId:string; nom:string; ... }[]
     }>
*/