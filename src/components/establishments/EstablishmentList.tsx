'use client';

import { useState } from 'react';
import EstablishmentCard from './EstablishmentCard';
import { Etablissement } from '@/types';
import Loading from '../Loading';
import { useQuery } from '@tanstack/react-query';
import { getAllEtablissementsAction } from '@/app/lib/services/actions/etablissements';
import { getAllEtablissements } from '@/app/lib/services/etablissement.service';
import { TransletText } from '@/app/lib/services/translation/transletText';

const LIMIT = 10; // items per page

const EstablishmentList = () => {
  const [offset, setOffset] = useState(0);

  const { data: etablissements = [], isLoading } = useQuery({
    queryKey: ['etablissements', LIMIT, offset],
    queryFn: async () => {
      const res = await getAllEtablissements(LIMIT, offset);
      if (!res) throw new Error('Failed to fetch');
      return res ?? [];
    },
  });

  const hasNext = etablissements.length === LIMIT;
  const hasPrev = offset > 0;

  const goNext = () => setOffset((o) => o + LIMIT);
  const goPrev = () => setOffset((o) => Math.max(0, o - LIMIT));

  if (isLoading) {
    return <Loading />;
  }

  if (etablissements.length === 0 && offset === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">
          <TransletText>Aucun établissement trouvé</TransletText>
        </h3>
        <p className="text-gray-600">
          <TransletText>Essayez de modifier vos critères de recherche</TransletText>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {etablissements.length > 0 ? (
            <>
              {etablissements.length}
              <TransletText> établissements trouvés</TransletText>
            </>
          ) : (
            <TransletText>0 établissement</TransletText>
          )}
        </p>
      </div>

      <div className="space-y-4">
        {etablissements.map((establishment) => (
          <EstablishmentCard
            key={establishment.id}
            establishment={establishment}
            firstImageUrl={establishment.firstImageUrl}
          />
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className={`px-4 py-2 rounded ${
            hasPrev
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <TransletText>Précédent</TransletText>
        </button>

        <button
          onClick={goNext}
          disabled={!hasNext}
          className={`px-4 py-2 rounded ${
            hasNext
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <TransletText>Suivant</TransletText>
        </button>
      </div>
    </div>
  );
};

export default EstablishmentList;