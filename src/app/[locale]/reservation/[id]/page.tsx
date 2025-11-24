import ReservationValidationPage from "@/components/rooms/reservation";

export default async function reservation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>
    <ReservationValidationPage roomId={id} />
  </div>;
}
