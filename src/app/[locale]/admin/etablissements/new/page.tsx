
import EstablishmentForm from '@/components/admin/EstablishmentForm';

export default async function NewEstablishmentPage() {
  // Check if user is authenticated and is an admin

  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Ajouter un établissement</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <EstablishmentForm />
      </div>
    </div>
  );
}