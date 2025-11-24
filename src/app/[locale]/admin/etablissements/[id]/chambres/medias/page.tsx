import MediaChambres from "@/components/admin/mediaChambres";

export default async function Page({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  return <MediaChambres etablissementId={id} locale={locale} />;
}
