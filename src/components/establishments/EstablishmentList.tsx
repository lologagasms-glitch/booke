'use client';

import { useState } from 'react';
import EstablishmentCard from './EstablishmentCard';
import Loading from '../Loading';
import { TransletText } from '@/app/lib/services/translation/transletText';
import { DataEtabs } from '@/app/api/etablissement/getall/route';


const EstablishmentList = ({etablissements, isLoading, error,offset,hasNext,hasPrev,goNext,goPrev}: {etablissements: DataEtabs, isLoading: boolean, error: Error | null,offset: number,hasNext: boolean,hasPrev: boolean,goNext: () => void,goPrev: () => void}) => {
  

  

 
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
            key={establishment.etablissements.id}
            establishment={establishment.etablissements}
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