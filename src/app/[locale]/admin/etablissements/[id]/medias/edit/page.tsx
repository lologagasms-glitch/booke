import MediaEtablissementManager from "@/components/admin/mediaEtabForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-4 md:p-6">
      <MediaEtablissementManager etablissementId={id} />
    </div>
  );
}
