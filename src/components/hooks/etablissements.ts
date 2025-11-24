// hooks/etablissement.ts
"use client"
import { getPopularEtablissementsAction } from '@/app/lib/services/actions/etablissements';
import { getPopularEtablissements } from '@/app/lib/services/etablissement.service';
import { useQuery } from '@tanstack/react-query';

export function usePopularEtablissements(opts?: { limit?: number }) {
  return useQuery({
    queryKey: ['popular-etablissements', opts?.limit],
    queryFn: () =>
      getPopularEtablissements(opts?.limit ?? 10).then(
        (data) => {
          console.log("popular-etablissements",data)
          return data||[]
        }
      ),
  });
}

/*  type inféré  →  useQuery<{
        data: { etablissementId:string; nom:string; ... }[]
     }>
*/