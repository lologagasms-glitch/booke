import MediaChambreForm from "@/components/admin/mediaChambreForm";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; idchambre: string }>;
}) {
  const { locale, idchambre } = await params;
  return (
    <div>
      <MediaChambreForm chambreId={idchambre} />
    </div>
  );
}
