// hooks/useReservations.ts
import type { getReservationsByUserId } from '@/app/api/reservations/clientReservations/services.db';
import  { useQuery } from '@tanstack/react-query';

export type ReservationRow = Awaited<
  ReturnType<typeof getReservationsByUserId>
>[number];
async function fetchReservations(signal?: AbortSignal) {
  const res = await fetch('/api/reservations/clientReservations', { signal });
  if (!res.ok) throw new Error((await res.json()).error || 'Erreur serveur');
  return res.json() as Promise<{ reservations: ReservationRow[] }>;
}

export function useReservations() {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: ({ signal }) => fetchReservations(signal),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}