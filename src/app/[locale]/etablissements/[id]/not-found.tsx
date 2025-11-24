import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Établissement non trouvé</h2>
      <p className="text-gray-600 mb-8">
        L'établissement que vous recherchez n'existe pas ou a été supprimé.
      </p>
      <Link 
        href="/etablissements"
        className="bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition-colors"
      >
        Voir tous les établissements
      </Link>
    </div>
  );
}